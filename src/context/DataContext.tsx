import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  db, 
  auth, 
  storage,
  uploadFile
} from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  deleteField,
  onSnapshot,
  query,
  where,
  writeBatch,
  getDocs,
  addDoc,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

type ProfileData = {
  name: string;
  title: string;
  university: string;
  education: string;
  imageUrl: string;
  phone: string;
  email: string;
  websiteUrl: string;
  about: string;
};

type ResearchInterest = {
  id: string;
  title: string;
};

type TeachingInterest = {
  id: string;
  title: string;
};

type Experience = {
  id: string;
  title: string;
  company: string;
  location?: string;
  startdate: string;
  enddate?: string;
  description?: string;
};

type Publication = {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  url?: string;
};

type BookChapter = {
  id: string;
  title: string;
  authors: string;
  bookTitle: string;
  editors?: string;
  publisher: string;
  year: string;
  pages?: string;
  url?: string;
};

type Talk = {
  id: string;
  title: string;
  venue: string;
  date: string;
  description?: string;
};

type Activity = {
  id: string;
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate?: string;
};

type Conference = {
  id: string;
  title: string;
  venue: string;
  date: string;
  role?: string;
  description?: string;
};

type Lab = {
  id: string;
  name: string;
  description: string;
  research: string[];
  members: string[];
  imageUrl?: string;
  location?: {
    room: string;
    building: string;
    university: string;
    city: string;
    country: string;
  };
  equipment?: string[];
  labHours?: {
    weekdays: string;
    weekends: string;
  };
};

type Award = {
  id: string;
  title: string;
  date: string;
};

type FinancialSupport = {
  id: string;
  title: string;
  fundReceived: string;
  duration: string;
};

type DataContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  profile: ProfileData | null;
  researchInterests: ResearchInterest[];
  teachingInterests: TeachingInterest[];
  experiences: Experience[];
  publications: Publication[];
  bookChapters: BookChapter[];
  talks: Talk[];
  activities: Activity[];
  conferences: Conference[];
  lab: Lab | null;
  awards: Award[];
  financialSupports: FinancialSupport[];
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  addResearchInterest: (interest: string) => Promise<void>;
  removeResearchInterest: (id: string) => Promise<void>;
  addTeachingInterest: (interest: string) => Promise<void>;
  removeTeachingInterest: (id: string) => Promise<void>;
  addExperience: (experience: Omit<Experience, 'id'>) => Promise<void>;
  updateExperience: (id: string, experience: Partial<Experience>) => Promise<void>;
  removeExperience: (id: string) => Promise<void>;
  addPublication: (pub: Omit<Publication, 'id'>) => Promise<void>;
  updatePublication: (id: string, pub: Partial<Publication>) => Promise<void>;
  removePublication: (id: string) => Promise<void>;
  addBookChapter: (chapter: Omit<BookChapter, 'id'>) => Promise<void>;
  updateBookChapter: (id: string, chapter: Partial<BookChapter>) => Promise<void>;
  removeBookChapter: (id: string) => Promise<void>;
  addTalk: (talk: Omit<Talk, 'id'>) => Promise<void>;
  updateTalk: (id: string, talk: Partial<Talk>) => Promise<void>;
  removeTalk: (id: string) => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id'>) => Promise<void>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
  removeActivity: (id: string) => Promise<void>;
  addConference: (conference: Omit<Conference, 'id'>) => Promise<void>;
  updateConference: (id: string, conference: Partial<Conference>) => Promise<void>;
  removeConference: (id: string) => Promise<void>;
  updateLab: (data: Partial<Lab>) => Promise<void>;
  addLabMember: (member: string) => Promise<void>;
  removeLabMember: (member: string) => Promise<void>;
  addLabResearch: (research: string) => Promise<void>;
  removeLabResearch: (research: string) => Promise<void>;
  addAward: (award: Omit<Award, 'id'>) => Promise<void>;
  updateAward: (id: string, award: Partial<Award>) => Promise<void>;
  removeAward: (id: string) => Promise<void>;
  addFinancialSupport: (support: Omit<FinancialSupport, 'id'>) => Promise<void>;
  updateFinancialSupport: (id: string, support: Partial<FinancialSupport>) => Promise<void>;
  removeFinancialSupport: (id: string) => Promise<void>;
  isLoading: boolean;
};

const COLLECTIONS = {
  PROFILE: 'profile',
  RESEARCH_INTERESTS: 'researchInterests',
  TEACHING_INTERESTS: 'teachingInterests',
  EXPERIENCES: 'experiences',
  PUBLICATIONS: 'publications',
  BOOK_CHAPTERS: 'bookChapters',
  TALKS: 'talks',
  ACTIVITIES: 'activities',
  CONFERENCES: 'conferences',
  LAB: 'lab',
  AUTH: 'authentication',
  AWARDS: 'awards',
  FINANCIAL_SUPPORTS: 'financialSupports'
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [researchInterests, setResearchInterests] = useState<ResearchInterest[]>([]);
  const [teachingInterests, setTeachingInterests] = useState<TeachingInterest[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [bookChapters, setBookChapters] = useState<BookChapter[]>([]);
  const [talks, setTalks] = useState<Talk[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [lab, setLab] = useState<Lab | null>(null);
  const [awards, setAwards] = useState<Award[]>([]);
  const [financialSupports, setFinancialSupports] = useState<FinancialSupport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      console.log("Auth state changed, user:", user?.email);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('Setting up real-time data listeners...');
    
    const unsubscribeProfile = onSnapshot(doc(db, COLLECTIONS.PROFILE, 'main'), (snapshot) => {
      if (snapshot.exists()) {
        console.log('Profile data updated from Firestore');
        setProfile(snapshot.data() as ProfileData);
      }
    }, (error) => {
      console.error('Error listening to profile:', error);
      setIsLoading(false);
    });
    
    const unsubscribeResearch = onSnapshot(doc(db, COLLECTIONS.RESEARCH_INTERESTS, 'list'), (snapshot) => {
      if (snapshot.exists() && snapshot.data().items) {
        console.log('Research interests updated from Firestore');
        setResearchInterests(snapshot.data().items);
      }
    }, (error) => {
      console.error('Error listening to research interests:', error);
    });
    
    const unsubscribeTeaching = onSnapshot(doc(db, COLLECTIONS.TEACHING_INTERESTS, 'list'), (snapshot) => {
      if (snapshot.exists() && snapshot.data().items) {
        console.log('Teaching interests updated from Firestore');
        setTeachingInterests(snapshot.data().items);
      }
    }, (error) => {
      console.error('Error listening to teaching interests:', error);
    });
    
    const unsubscribeExperiences = onSnapshot(doc(db, COLLECTIONS.EXPERIENCES, 'list'), (snapshot) => {
      if (snapshot.exists() && snapshot.data().items) {
        console.log('Experiences updated from Firestore');
        setExperiences(snapshot.data().items);
      }
    }, (error) => {
      console.error('Error listening to experiences:', error);
    });
    
    const unsubscribePublications = onSnapshot(doc(db, COLLECTIONS.PUBLICATIONS, 'list'), (snapshot) => {
      if (snapshot.exists() && snapshot.data().items) {
        console.log('Publications updated from Firestore');
        setPublications(snapshot.data().items);
      }
    }, (error) => {
      console.error('Error listening to publications:', error);
    });
    
    const unsubscribeBookChapters = onSnapshot(doc(db, COLLECTIONS.BOOK_CHAPTERS, 'list'), (snapshot) => {
      if (snapshot.exists() && snapshot.data().items) {
        console.log('Book chapters updated from Firestore');
        setBookChapters(snapshot.data().items);
      }
    }, (error) => {
      console.error('Error listening to book chapters:', error);
    });
    
    const unsubscribeTalks = onSnapshot(doc(db, COLLECTIONS.TALKS, 'list'), (snapshot) => {
      if (snapshot.exists() && snapshot.data().items) {
        console.log('Talks updated from Firestore');
        setTalks(snapshot.data().items);
      }
    }, (error) => {
      console.error('Error listening to talks:', error);
    });
    
    const unsubscribeActivities = onSnapshot(doc(db, COLLECTIONS.ACTIVITIES, 'list'), (snapshot) => {
      if (snapshot.exists() && snapshot.data().items) {
        console.log('Activities updated from Firestore');
        setActivities(snapshot.data().items);
      }
    }, (error) => {
      console.error('Error listening to activities:', error);
    });

    const unsubscribeConferences = onSnapshot(doc(db, COLLECTIONS.CONFERENCES, 'list'), (snapshot) => {
      if (snapshot.exists() && snapshot.data().items) {
        console.log('Conferences updated from Firestore');
        setConferences(snapshot.data().items);
      }
    }, (error) => {
      console.error('Error listening to conferences:', error);
    });
    
    const unsubscribeLab = onSnapshot(doc(db, COLLECTIONS.LAB, 'main'), (snapshot) => {
      if (snapshot.exists()) {
        console.log('Lab data updated from Firestore');
        const labData = snapshot.data() as Lab;
        // Ensure backward compatibility with existing data
        if (!labData.location) {
          labData.location = {
            room: 'Room 403',
            building: 'Engineering Building',
            university: 'Netaji Subhas University Of Technology',
            city: 'New Delhi',
            country: 'India'
          };
        }
        if (!labData.equipment) {
          labData.equipment = [
            'High-performance computing cluster',
            'Medical imaging workstations',
            'Signal acquisition devices',
            'Data analysis software suite'
          ];
        }
        if (!labData.labHours) {
          labData.labHours = {
            weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
            weekends: 'Weekends: By appointment only'
          };
        }
        setLab(labData);
      }
    }, (error) => {
      console.error('Error listening to lab data:', error);
    });

    const unsubscribeAwards = onSnapshot(doc(db, COLLECTIONS.AWARDS, 'list'), (snapshot) => {
      if (snapshot.exists() && snapshot.data().items) {
        console.log('Awards updated from Firestore');
        setAwards(snapshot.data().items);
      }
    }, (error) => {
      console.error('Error listening to awards:', error);
    });
    
    const unsubscribeFinancialSupports = onSnapshot(doc(db, COLLECTIONS.FINANCIAL_SUPPORTS, 'list'), (snapshot) => {
      if (snapshot.exists() && snapshot.data().items) {
        console.log('Financial supports updated from Firestore');
        setFinancialSupports(snapshot.data().items);
      }
    }, (error) => {
      console.error('Error listening to financial supports:', error);
    });
    
    // Set loading to false once we have initial data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      unsubscribeProfile();
      unsubscribeResearch();
      unsubscribeTeaching();
      unsubscribeExperiences();
      unsubscribePublications();
      unsubscribeBookChapters();
      unsubscribeTalks();
      unsubscribeActivities();
      unsubscribeConferences();
      unsubscribeLab();
      unsubscribeAwards();
      unsubscribeFinancialSupports();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      return auth.currentUser !== null;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update profile');
      }
      
      await updateDoc(doc(db, COLLECTIONS.PROFILE, 'main'), data);
      console.log('Profile updated in Firestore');
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  };

  const addResearchInterest = async (interest: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add research interests');
      }
      
      const newInterest = { id: Date.now().toString(), title: interest };
      const updatedInterests = [...researchInterests, newInterest];
      
      await setDoc(doc(db, COLLECTIONS.RESEARCH_INTERESTS, 'list'), {
        items: updatedInterests
      });
      console.log('Research interest added to Firestore');
      
      toast({
        title: "Research interest added",
        description: "Your research interest has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding research interest:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your research interest.",
        variant: "destructive",
      });
    }
  };

  const removeResearchInterest = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove research interests');
      }
      
      const updatedInterests = researchInterests.filter(interest => interest.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.RESEARCH_INTERESTS, 'list'), {
        items: updatedInterests
      });
      console.log('Research interest removed from Firestore');
      
      toast({
        title: "Research interest removed",
        description: "Your research interest has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing research interest:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your research interest.",
        variant: "destructive",
      });
    }
  };

  const addTeachingInterest = async (interest: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add teaching interests');
      }
      
      const newInterest = { id: Date.now().toString(), title: interest };
      const updatedInterests = [...teachingInterests, newInterest];
      
      await setDoc(doc(db, COLLECTIONS.TEACHING_INTERESTS, 'list'), {
        items: updatedInterests
      });
      console.log('Teaching interest added to Firestore');
      
      toast({
        title: "Teaching interest added",
        description: "Your teaching interest has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding teaching interest:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your teaching interest.",
        variant: "destructive",
      });
    }
  };

  const removeTeachingInterest = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove teaching interests');
      }
      
      const updatedInterests = teachingInterests.filter(interest => interest.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.TEACHING_INTERESTS, 'list'), {
        items: updatedInterests
      });
      console.log('Teaching interest removed from Firestore');
      
      toast({
        title: "Teaching interest removed",
        description: "Your teaching interest has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing teaching interest:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your teaching interest.",
        variant: "destructive",
      });
    }
  };

  const addExperience = async (experience: Omit<Experience, 'id'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add experiences');
      }
      
      const newExperience = { id: Date.now().toString(), ...experience };
      const updatedExperiences = [...experiences, newExperience];
      
      await setDoc(doc(db, COLLECTIONS.EXPERIENCES, 'list'), {
        items: updatedExperiences
      });
      console.log('Experience added to Firestore');
      
      toast({
        title: "Experience added",
        description: "Your experience has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding experience:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your experience.",
        variant: "destructive",
      });
    }
  };

  const updateExperience = async (id: string, experience: Partial<Experience>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update experiences');
      }
      
      const updatedExperiences = experiences.map(item => 
        item.id === id ? { ...item, ...experience } : item
      );
      
      await setDoc(doc(db, COLLECTIONS.EXPERIENCES, 'list'), {
        items: updatedExperiences
      });
      console.log('Experience updated in Firestore');
      
      toast({
        title: "Experience updated",
        description: "Your experience has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating experience:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your experience.",
        variant: "destructive",
      });
    }
  };

  const removeExperience = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove experiences');
      }
      
      const updatedExperiences = experiences.filter(exp => exp.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.EXPERIENCES, 'list'), {
        items: updatedExperiences
      });
      console.log('Experience removed from Firestore');
      
      toast({
        title: "Experience removed",
        description: "Your experience has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing experience:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your experience.",
        variant: "destructive",
      });
    }
  };

  const addPublication = async (pub: Omit<Publication, 'id'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add publications');
      }
      
      const newPublication = { id: Date.now().toString(), ...pub };
      const updatedPublications = [...publications, newPublication];
      
      await setDoc(doc(db, COLLECTIONS.PUBLICATIONS, 'list'), {
        items: updatedPublications
      });
      console.log('Publication added to Firestore');
      
      toast({
        title: "Publication added",
        description: "Your publication has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding publication:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your publication.",
        variant: "destructive",
      });
    }
  };

  const updatePublication = async (id: string, pub: Partial<Publication>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update publications');
      }
      
      const updatedPublications = publications.map(item => 
        item.id === id ? { ...item, ...pub } : item
      );
      
      await setDoc(doc(db, COLLECTIONS.PUBLICATIONS, 'list'), {
        items: updatedPublications
      });
      console.log('Publication updated in Firestore');
      
      toast({
        title: "Publication updated",
        description: "Your publication has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating publication:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your publication.",
        variant: "destructive",
      });
    }
  };

  const removePublication = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove publications');
      }
      
      const updatedPublications = publications.filter(pub => pub.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.PUBLICATIONS, 'list'), {
        items: updatedPublications
      });
      console.log('Publication removed from Firestore');
      
      toast({
        title: "Publication removed",
        description: "Your publication has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing publication:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your publication.",
        variant: "destructive",
      });
    }
  };

  const addBookChapter = async (chapter: Omit<BookChapter, 'id'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add book chapters');
      }
      
      const newChapter = { id: Date.now().toString(), ...chapter };
      const updatedChapters = [...bookChapters, newChapter];
      
      await setDoc(doc(db, COLLECTIONS.BOOK_CHAPTERS, 'list'), {
        items: updatedChapters
      });
      console.log('Book chapter added to Firestore');
      
      toast({
        title: "Book chapter added",
        description: "Your book chapter has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding book chapter:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your book chapter.",
        variant: "destructive",
      });
    }
  };

  const updateBookChapter = async (id: string, chapter: Partial<BookChapter>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update book chapters');
      }
      
      const updatedChapters = bookChapters.map(item => 
        item.id === id ? { ...item, ...chapter } : item
      );
      
      await setDoc(doc(db, COLLECTIONS.BOOK_CHAPTERS, 'list'), {
        items: updatedChapters
      });
      console.log('Book chapter updated in Firestore');
      
      toast({
        title: "Book chapter updated",
        description: "Your book chapter has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating book chapter:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your book chapter.",
        variant: "destructive",
      });
    }
  };

  const removeBookChapter = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove book chapters');
      }
      
      const updatedChapters = bookChapters.filter(chapter => chapter.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.BOOK_CHAPTERS, 'list'), {
        items: updatedChapters
      });
      console.log('Book chapter removed from Firestore');
      
      toast({
        title: "Book chapter removed",
        description: "Your book chapter has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing book chapter:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your book chapter.",
        variant: "destructive",
      });
    }
  };

  const addTalk = async (talk: Omit<Talk, 'id'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add talks');
      }
      
      const newTalk = { id: Date.now().toString(), ...talk };
      const updatedTalks = [...talks, newTalk];
      
      await setDoc(doc(db, COLLECTIONS.TALKS, 'list'), {
        items: updatedTalks
      });
      console.log('Talk added to Firestore');
      
      toast({
        title: "Talk added",
        description: "Your talk has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding talk:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your talk.",
        variant: "destructive",
      });
    }
  };

  const updateTalk = async (id: string, talk: Partial<Talk>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update talks');
      }
      
      const updatedTalks = talks.map(item => 
        item.id === id ? { ...item, ...talk } : item
      );
      
      await setDoc(doc(db, COLLECTIONS.TALKS, 'list'), {
        items: updatedTalks
      });
      console.log('Talk updated in Firestore');
      
      toast({
        title: "Talk updated",
        description: "Your talk has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating talk:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your talk.",
        variant: "destructive",
      });
    }
  };

  const removeTalk = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove talks');
      }
      
      const updatedTalks = talks.filter(talk => talk.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.TALKS, 'list'), {
        items: updatedTalks
      });
      console.log('Talk removed from Firestore');
      
      toast({
        title: "Talk removed",
        description: "Your talk has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing talk:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your talk.",
        variant: "destructive",
      });
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add activities');
      }
      
      const newActivity = { id: Date.now().toString(), ...activity };
      const updatedActivities = [...activities, newActivity];
      
      await setDoc(doc(db, COLLECTIONS.ACTIVITIES, 'list'), {
        items: updatedActivities
      });
      console.log('Activity added to Firestore');
      
      toast({
        title: "Activity added",
        description: "Your activity has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding activity:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your activity.",
        variant: "destructive",
      });
    }
  };

  const updateActivity = async (id: string, activity: Partial<Activity>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update activities');
      }
      
      const updatedActivities = activities.map(item => 
        item.id === id ? { ...item, ...activity } : item
      );
      
      await setDoc(doc(db, COLLECTIONS.ACTIVITIES, 'list'), {
        items: updatedActivities
      });
      console.log('Activity updated in Firestore');
      
      toast({
        title: "Activity updated",
        description: "Your activity has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating activity:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your activity.",
        variant: "destructive",
      });
    }
  };

  const removeActivity = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove activities');
      }
      
      const updatedActivities = activities.filter(activity => activity.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.ACTIVITIES, 'list'), {
        items: updatedActivities
      });
      console.log('Activity removed from Firestore');
      
      toast({
        title: "Activity removed",
        description: "Your activity has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing activity:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your activity.",
        variant: "destructive",
      });
    }
  };

  const addConference = async (conference: Omit<Conference, 'id'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add conferences');
      }
      
      const newConference = { id: Date.now().toString(), ...conference };
      const updatedConferences = [...conferences, newConference];
      
      await setDoc(doc(db, COLLECTIONS.CONFERENCES, 'list'), {
        items: updatedConferences
      });
      console.log('Conference added to Firestore');
      
      toast({
        title: "Conference added",
        description: "Your conference has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding conference:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your conference.",
        variant: "destructive",
      });
    }
  };

  const updateConference = async (id: string, conference: Partial<Conference>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update conferences');
      }
      
      const updatedConferences = conferences.map(item => 
        item.id === id ? { ...item, ...conference } : item
      );
      
      await setDoc(doc(db, COLLECTIONS.CONFERENCES, 'list'), {
        items: updatedConferences
      });
      console.log('Conference updated in Firestore');
      
      toast({
        title: "Conference updated",
        description: "Your conference has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating conference:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your conference.",
        variant: "destructive",
      });
    }
  };

  const removeConference = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove conferences');
      }
      
      const updatedConferences = conferences.filter(conference => conference.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.CONFERENCES, 'list'), {
        items: updatedConferences
      });
      console.log('Conference removed from Firestore');
      
      toast({
        title: "Conference removed",
        description: "Your conference has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing conference:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your conference.",
        variant: "destructive",
      });
    }
  };

  const updateLab = async (data: Partial<Lab>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update lab information');
      }
      
      console.log('Updating lab with data:', data);
      
      await updateDoc(doc(db, COLLECTIONS.LAB, 'main'), data);
      console.log('Lab updated in Firestore');
      
      toast({
        title: "Lab updated",
        description: "Your lab information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating lab:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your lab information.",
        variant: "destructive",
      });
    }
  };

  const addLabMember = async (member: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add lab members');
      }
      
      console.log('Adding lab member:', member);
      
      if (lab && lab.members.includes(member)) {
        toast({
          title: "Member already exists",
          description: "This lab member is already in the list.",
          variant: "destructive",
        });
        return;
      }
      
      const updatedMembers = lab ? [...lab.members, member] : [member];
      
      await updateDoc(doc(db, COLLECTIONS.LAB, 'main'), {
        members: updatedMembers
      });
      
      console.log('Lab member added to Firestore with updated members:', updatedMembers);
      
      toast({
        title: "Lab member added",
        description: "The lab member has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding lab member:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding the lab member.",
        variant: "destructive",
      });
    }
  };

  const removeLabMember = async (member: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove lab members');
      }
      
      console.log('Removing lab member:', member);
      
      const updatedMembers = lab ? lab.members.filter(m => m !== member) : [];
      
      await updateDoc(doc(db, COLLECTIONS.LAB, 'main'), {
        members: updatedMembers
      });
      
      console.log('Lab member removed from Firestore');
      
      toast({
        title: "Lab member removed",
        description: "The lab member has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing lab member:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing the lab member.",
        variant: "destructive",
      });
    }
  };

  const addLabResearch = async (research: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add research areas');
      }
      
      console.log('Adding research area:', research);
      
      if (lab && lab.research.includes(research)) {
        toast({
          title: "Research area already exists",
          description: "This research area is already in the list.",
          variant: "destructive",
        });
        return;
      }
      
      const updatedResearch = lab ? [...lab.research, research] : [research];
      
      await updateDoc(doc(db, COLLECTIONS.LAB, 'main'), {
        research: updatedResearch
      });
      
      console.log('Research area added to Firestore with updated research:', updatedResearch);
      
      toast({
        title: "Research area added",
        description: "The research area has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding research area:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding the research area.",
        variant: "destructive",
      });
    }
  };

  const removeLabResearch = async (research: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove research areas');
      }
      
      console.log('Removing research area:', research);
      
      const updatedResearch = lab ? lab.research.filter(r => r !== research) : [];
      
      await updateDoc(doc(db, COLLECTIONS.LAB, 'main'), {
        research: updatedResearch
      });
      
      console.log('Research area removed from Firestore');
      
      toast({
        title: "Research area removed",
        description: "The research area has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing research area:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing the research area.",
        variant: "destructive",
      });
    }
  };

  const addAward = async (award: Omit<Award, 'id'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add awards');
      }
      
      const newAward = { id: Date.now().toString(), ...award };
      const updatedAwards = [...awards, newAward];
      
      await setDoc(doc(db, COLLECTIONS.AWARDS, 'list'), {
        items: updatedAwards
      });
      console.log('Award added to Firestore');
      
      toast({
        title: "Award added",
        description: "Your award has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding award:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your award.",
        variant: "destructive",
      });
    }
  };

  const updateAward = async (id: string, award: Partial<Award>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update awards');
      }
      
      const updatedAwards = awards.map(item => 
        item.id === id ? { ...item, ...award } : item
      );
      
      await setDoc(doc(db, COLLECTIONS.AWARDS, 'list'), {
        items: updatedAwards
      });
      console.log('Award updated in Firestore');
      
      toast({
        title: "Award updated",
        description: "Your award has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating award:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your award.",
        variant: "destructive",
      });
    }
  };

  const removeAward = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove awards');
      }
      
      const updatedAwards = awards.filter(award => award.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.AWARDS, 'list'), {
        items: updatedAwards
      });
      console.log('Award removed from Firestore');
      
      toast({
        title: "Award removed",
        description: "Your award has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing award:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your award.",
        variant: "destructive",
      });
    }
  };

  const addFinancialSupport = async (support: Omit<FinancialSupport, 'id'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to add financial support');
      }
      
      const newSupport = { id: Date.now().toString(), ...support };
      const updatedSupports = [...financialSupports, newSupport];
      
      await setDoc(doc(db, COLLECTIONS.FINANCIAL_SUPPORTS, 'list'), {
        items: updatedSupports
      });
      console.log('Financial support added to Firestore');
      
      toast({
        title: "Financial support added",
        description: "Your financial support has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding financial support:', error);
      toast({
        title: "Addition failed",
        description: "There was an error adding your financial support.",
        variant: "destructive",
      });
    }
  };

  const updateFinancialSupport = async (id: string, support: Partial<FinancialSupport>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update financial support');
      }
      
      const updatedSupports = financialSupports.map(item => 
        item.id === id ? { ...item, ...support } : item
      );
      
      await setDoc(doc(db, COLLECTIONS.FINANCIAL_SUPPORTS, 'list'), {
        items: updatedSupports
      });
      console.log('Financial support updated in Firestore');
      
      toast({
        title: "Financial support updated",
        description: "Your financial support has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating financial support:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your financial support.",
        variant: "destructive",
      });
    }
  };

  const removeFinancialSupport = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to remove financial support');
      }
      
      const updatedSupports = financialSupports.filter(support => support.id !== id);
      
      await setDoc(doc(db, COLLECTIONS.FINANCIAL_SUPPORTS, 'list'), {
        items: updatedSupports
      });
      console.log('Financial support removed from Firestore');
      
      toast({
        title: "Financial support removed",
        description: "Your financial support has been removed successfully.",
      });
    } catch (error) {
      console.error('Error removing financial support:', error);
      toast({
        title: "Removal failed",
        description: "There was an error removing your financial support.",
        variant: "destructive",
      });
    }
  };

  const contextValue: DataContextType = {
    isAuthenticated,
    login,
    logout,
    profile,
    researchInterests,
    teachingInterests,
    experiences,
    publications,
    bookChapters,
    talks,
    activities,
    conferences,
    lab,
    awards,
    financialSupports,
    updateProfile,
    addResearchInterest,
    removeResearchInterest,
    addTeachingInterest,
    removeTeachingInterest,
    addExperience,
    updateExperience,
    removeExperience,
    addPublication,
    updatePublication,
    removePublication,
    addBookChapter,
    updateBookChapter,
    removeBookChapter,
    addTalk,
    updateTalk,
    removeTalk,
    addActivity,
    updateActivity,
    removeActivity,
    addConference,
    updateConference,
    removeConference,
    updateLab,
    addLabMember,
    removeLabMember,
    addLabResearch,
    removeLabResearch,
    addAward,
    updateAward,
    removeAward,
    addFinancialSupport,
    updateFinancialSupport,
    removeFinancialSupport,
    isLoading
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
