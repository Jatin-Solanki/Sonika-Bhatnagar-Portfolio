
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Edit2, X, Check } from 'lucide-react';

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

type ActivityFormData = Omit<Activity, 'id'>;
type ConferenceFormData = Omit<Conference, 'id'>;

const ActivitiesEditor: React.FC = () => {
  const { 
    activities, 
    conferences,
    addActivity, 
    updateActivity, 
    removeActivity,
    addConference,
    updateConference,
    removeConference
  } = useData();
  const { toast } = useToast();
  
  // Activity states
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  
  const emptyActivity: ActivityFormData = {
    title: '',
    organization: '',
    description: '',
    startDate: '',
    endDate: ''
  };
  
  const [newActivity, setNewActivity] = useState<ActivityFormData>(emptyActivity);
  const [editActivity, setEditActivity] = useState<Activity | null>(null);

  // Conference states
  const [isAddingConference, setIsAddingConference] = useState(false);
  const [editingConferenceId, setEditingConferenceId] = useState<string | null>(null);
  
  const emptyConference: ConferenceFormData = {
    title: '',
    venue: '',
    date: '',
    role: '',
    description: ''
  };
  
  const [newConference, setNewConference] = useState<ConferenceFormData>(emptyConference);
  const [editConference, setEditConference] = useState<Conference | null>(null);

  // Activity handlers
  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addActivity(newActivity);
    setNewActivity(emptyActivity);
    setIsAddingActivity(false);
    
    toast({
      title: "Activity added",
      description: "Your volunteer activity has been added successfully.",
    });
  };

  const handleEditActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editActivity) return;
    
    const { id, ...data } = editActivity;
    updateActivity(id, data);
    setEditingActivityId(null);
    setEditActivity(null);
    
    toast({
      title: "Activity updated",
      description: "Your volunteer activity has been updated successfully.",
    });
  };

  const handleRemoveActivity = (id: string, title: string) => {
    removeActivity(id);
    
    toast({
      title: "Activity removed",
      description: `"${title}" has been removed from your volunteer activities.`,
    });
  };

  const startEditingActivity = (activity: Activity) => {
    setEditingActivityId(activity.id);
    setEditActivity(activity);
  };

  const cancelEditingActivity = () => {
    setEditingActivityId(null);
    setEditActivity(null);
  };

  // Conference handlers
  const handleAddConferenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addConference(newConference);
    setNewConference(emptyConference);
    setIsAddingConference(false);
    
    toast({
      title: "Conference added",
      description: "Your conference has been added successfully.",
    });
  };

  const handleEditConferenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editConference) return;
    
    const { id, ...data } = editConference;
    updateConference(id, data);
    setEditingConferenceId(null);
    setEditConference(null);
    
    toast({
      title: "Conference updated",
      description: "Your conference has been updated successfully.",
    });
  };

  const handleRemoveConference = (id: string, title: string) => {
    removeConference(id);
    
    toast({
      title: "Conference removed",
      description: `"${title}" has been removed from your conferences.`,
    });
  };

  const startEditingConference = (conference: Conference) => {
    setEditingConferenceId(conference.id);
    setEditConference(conference);
  };

  const cancelEditingConference = () => {
    setEditingConferenceId(null);
    setEditConference(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Activities & Conferences</h1>
      
      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activities">Academic Activities</TabsTrigger>
          <TabsTrigger value="conferences">Conferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activities" className="space-y-6">
          {!isAddingActivity ? (
            <div className="mb-6">
              <Button 
                onClick={() => setIsAddingActivity(true)}
                className="bg-university-red hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Activity
              </Button>
            </div>
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Academic Activity</CardTitle>
                <CardDescription>
                  Enter the details of your professional or community service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddActivitySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="title">Title/Role</Label>
                      <Input
                        id="title"
                        value={newActivity.title}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Position or role title"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={newActivity.organization}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, organization: e.target.value }))}
                        placeholder="Organization or committee name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        value={newActivity.startDate}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, startDate: e.target.value }))}
                        placeholder="e.g., 2025, January 2025, 2025-01"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date (leave blank if ongoing)</Label>
                      <Input
                        id="endDate"
                        value={newActivity.endDate || ''}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, endDate: e.target.value }))}
                        placeholder="e.g., 2025, December 2025, 2025-12"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of your role and responsibilities"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingActivity(false);
                        setNewActivity(emptyActivity);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-university-red hover:bg-red-700"
                    >
                      Add Activity
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Your Volunteer Activities</CardTitle>
              <CardDescription>
                Manage your professional and community service activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      {editingActivityId === activity.id && editActivity ? (
                        <form onSubmit={handleEditActivitySubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`edit-title-${activity.id}`}>Title/Role</Label>
                              <Input
                                id={`edit-title-${activity.id}`}
                                value={editActivity.title}
                                onChange={(e) => setEditActivity(prev => prev ? { ...prev, title: e.target.value } : null)}
                              />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`edit-organization-${activity.id}`}>Organization</Label>
                              <Input
                                id={`edit-organization-${activity.id}`}
                                value={editActivity.organization}
                                onChange={(e) => setEditActivity(prev => prev ? { ...prev, organization: e.target.value } : null)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`edit-startDate-${activity.id}`}>Start Date</Label>
                              <Input
                                id={`edit-startDate-${activity.id}`}
                                value={editActivity.startDate}
                                onChange={(e) => setEditActivity(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                                placeholder="e.g., 2025, January 2025, 2025-01"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`edit-endDate-${activity.id}`}>End Date</Label>
                              <Input
                                id={`edit-endDate-${activity.id}`}
                                value={editActivity.endDate || ''}
                                onChange={(e) => setEditActivity(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                                placeholder="e.g., 2025, December 2025, 2025-12"
                              />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`edit-description-${activity.id}`}>Description</Label>
                              <Textarea
                                id={`edit-description-${activity.id}`}
                                value={editActivity.description}
                                onChange={(e) => setEditActivity(prev => prev ? { ...prev, description: e.target.value } : null)}
                                rows={3}
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={cancelEditingActivity}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              className="bg-university-red hover:bg-red-700"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <h3 className="text-lg font-semibold">{activity.title}</h3>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditingActivity(activity)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveActivity(activity.id, activity.title)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-1">{activity.organization}</p>
                          <p className="text-gray-600 mt-1">
                            {activity.startDate}
                            {activity.endDate ? ` - ${activity.endDate}` : ' - Present'}
                          </p>
                          <p className="text-gray-700 mt-2 text-sm">{activity.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven't added any volunteer activities yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conferences" className="space-y-6">
          {!isAddingConference ? (
            <div className="mb-6">
              <Button 
                onClick={() => setIsAddingConference(true)}
                className="bg-university-red hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Conference
              </Button>
            </div>
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Conference</CardTitle>
                <CardDescription>
                  Enter the details of your conference participation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddConferenceSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="conf-title">Conference Title</Label>
                      <Input
                        id="conf-title"
                        value={newConference.title}
                        onChange={(e) => setNewConference(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Conference name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="conf-venue">Venue</Label>
                      <Input
                        id="conf-venue"
                        value={newConference.venue}
                        onChange={(e) => setNewConference(prev => ({ ...prev, venue: e.target.value }))}
                        placeholder="Location or venue"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="conf-date">Date</Label>
                      <Input
                        id="conf-date"
                        value={newConference.date}
                        onChange={(e) => setNewConference(prev => ({ ...prev, date: e.target.value }))}
                        placeholder="e.g., 2025, March 2025, 2025-03-15"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="conf-role">Role/Participation</Label>
                      <Input
                        id="conf-role"
                        value={newConference.role || ''}
                        onChange={(e) => setNewConference(prev => ({ ...prev, role: e.target.value }))}
                        placeholder="e.g., Speaker, Organizer, Attendee"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="conf-description">Description</Label>
                      <Textarea
                        id="conf-description"
                        value={newConference.description || ''}
                        onChange={(e) => setNewConference(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of your participation or contribution"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingConference(false);
                        setNewConference(emptyConference);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-university-red hover:bg-red-700"
                    >
                      Add Conference
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Your Conferences</CardTitle>
              <CardDescription>
                Manage your conference participation and contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conferences.length > 0 ? (
                <div className="space-y-4">
                  {conferences.map((conference) => (
                    <div 
                      key={conference.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      {editingConferenceId === conference.id && editConference ? (
                        <form onSubmit={handleEditConferenceSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`edit-conf-title-${conference.id}`}>Conference Title</Label>
                              <Input
                                id={`edit-conf-title-${conference.id}`}
                                value={editConference.title}
                                onChange={(e) => setEditConference(prev => prev ? { ...prev, title: e.target.value } : null)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`edit-conf-venue-${conference.id}`}>Venue</Label>
                              <Input
                                id={`edit-conf-venue-${conference.id}`}
                                value={editConference.venue}
                                onChange={(e) => setEditConference(prev => prev ? { ...prev, venue: e.target.value } : null)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`edit-conf-date-${conference.id}`}>Date</Label>
                              <Input
                                id={`edit-conf-date-${conference.id}`}
                                value={editConference.date}
                                onChange={(e) => setEditConference(prev => prev ? { ...prev, date: e.target.value } : null)}
                                placeholder="e.g., 2025, March 2025, 2025-03-15"
                              />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`edit-conf-role-${conference.id}`}>Role/Participation</Label>
                              <Input
                                id={`edit-conf-role-${conference.id}`}
                                value={editConference.role || ''}
                                onChange={(e) => setEditConference(prev => prev ? { ...prev, role: e.target.value } : null)}
                              />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`edit-conf-description-${conference.id}`}>Description</Label>
                              <Textarea
                                id={`edit-conf-description-${conference.id}`}
                                value={editConference.description || ''}
                                onChange={(e) => setEditConference(prev => prev ? { ...prev, description: e.target.value } : null)}
                                rows={3}
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={cancelEditingConference}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              className="bg-university-red hover:bg-red-700"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <h3 className="text-lg font-semibold">{conference.title}</h3>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditingConference(conference)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveConference(conference.id, conference.title)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-1">{conference.venue}</p>
                          <p className="text-gray-600 mt-1">{conference.date}</p>
                          {conference.role && (
                            <p className="text-gray-600 mt-1">Role: {conference.role}</p>
                          )}
                          {conference.description && (
                            <p className="text-gray-700 mt-2 text-sm">{conference.description}</p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven't added any conferences yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActivitiesEditor;
