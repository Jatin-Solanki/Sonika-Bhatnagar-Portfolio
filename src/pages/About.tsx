
import React from 'react';
import { useData } from '@/context/DataContext';
import SectionTitle from '@/components/SectionTitle';
import { UserCircle, Award, Calendar } from 'lucide-react';

const About: React.FC = () => {
  const { profile, activities } = useData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6">About Me</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <img 
                src={profile.imageUrl} 
                alt={profile.name} 
                className="w-full max-w-sm mx-auto rounded-lg shadow-md mb-4"
              />
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">{profile.name}</h2>
                <p className="text-gray-700 mb-1">{profile.title}</p>
                <p className="text-gray-700">{profile.university}</p>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <SectionTitle title="Biography" icon={<UserCircle className="w-5 h-5" />} />
              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed">{profile.about}</p>
                {/* <p className="text-gray-700 leading-relaxed mt-4">
                  As a dedicated professor at {profile.university.split(',')[0]}, 
                  I am committed to advancing research in the field of biomedical 
                  technology and providing quality education to the next generation 
                  of engineers and scientists.
                </p> */}
                {/* <p className="text-gray-700 leading-relaxed mt-4">
                  My research focuses on biomedical signal processing, medical imaging, 
                  and applications of machine learning in healthcare. I have published 
                  extensively in international journals and presented at numerous 
                  conferences worldwide.
                </p> */}
              </div>
              
              {/* <SectionTitle title="Professional Activities" icon={<Award className="w-5 h-5" />} /> */}
              {/* <div className="space-y-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="border-l-4 border-university-red pl-4 py-1">
                    <h3 className="text-lg font-semibold">{activity.title}</h3>
                    <p className="text-gray-600">{activity.organization}</p>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {activity.startDate} 
                        {activity.endDate ? ` - ${activity.endDate}` : ' - Present'}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700">{activity.description}</p>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
