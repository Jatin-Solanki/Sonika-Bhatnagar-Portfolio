import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Save } from 'lucide-react';

const LabEditor: React.FC = () => {
  const { lab, updateLab, addLabMember, removeLabMember, addLabResearch, removeLabResearch } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ ...lab });
  const [newMember, setNewMember] = useState('');
  const [newResearch, setNewResearch] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update local state when lab data changes from the context
  useEffect(() => {
    if (lab) {
      setFormData({ ...lab });
    }
  }, [lab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleLabHoursChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      labHours: {
        ...prev.labHours,
        [field]: value
      }
    }));
  };

  const handleAddEquipment = () => {
    if (!newEquipment.trim()) {
      toast({
        title: "Error",
        description: "Please enter equipment name.",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      equipment: [...(prev.equipment || []), newEquipment.trim()]
    }));
    setNewEquipment('');
  };

  const handleRemoveEquipment = (equipmentToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment?.filter(eq => eq !== equipmentToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateLab(formData);
      
      toast({
        title: "Lab information updated",
        description: "Your laboratory information has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating lab:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating the lab information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!newMember.trim()) {
      toast({
        title: "Error",
        description: "Please enter a member name.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addLabMember(newMember.trim());
      setNewMember('');
      
      toast({
        title: "Member added",
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

  const handleRemoveMember = async (member: string) => {
    try {
      await removeLabMember(member);
      
      toast({
        title: "Member removed",
        description: `"${member}" has been removed from the lab members.`,
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

  const handleAddResearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!newResearch.trim()) {
      toast({
        title: "Error",
        description: "Please enter a research area.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addLabResearch(newResearch.trim());
      setNewResearch('');
      
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

  const handleRemoveResearch = async (research: string) => {
    try {
      await removeLabResearch(research);
      
      toast({
        title: "Research area removed",
        description: `"${research}" has been removed from the research areas.`,
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

  if (!lab) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lab Information</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update your laboratory's basic details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Lab Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Lab Image URL (optional)</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl || ''}
                    onChange={handleChange}
                    placeholder="/path/to/lab-image.jpg"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img 
                        src={formData.imageUrl} 
                        alt="Lab Preview" 
                        className="h-40 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Information</CardTitle>
                <CardDescription>
                  Update your laboratory's location details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <Input
                      id="room"
                      value={formData.location?.room || ''}
                      onChange={(e) => handleLocationChange('room', e.target.value)}
                      placeholder="Room 403"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="building">Building</Label>
                    <Input
                      id="building"
                      value={formData.location?.building || ''}
                      onChange={(e) => handleLocationChange('building', e.target.value)}
                      placeholder="Engineering Building"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    value={formData.location?.university || ''}
                    onChange={(e) => handleLocationChange('university', e.target.value)}
                    placeholder="Netaji Subhas University Of Technology"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.location?.city || ''}
                      onChange={(e) => handleLocationChange('city', e.target.value)}
                      placeholder="New Delhi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.location?.country || ''}
                      onChange={(e) => handleLocationChange('country', e.target.value)}
                      placeholder="India"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lab Hours</CardTitle>
                <CardDescription>
                  Set your laboratory operating hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weekdays">Weekday Hours</Label>
                  <Input
                    id="weekdays"
                    value={formData.labHours?.weekdays || ''}
                    onChange={(e) => handleLabHoursChange('weekdays', e.target.value)}
                    placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weekends">Weekend Hours</Label>
                  <Input
                    id="weekends"
                    value={formData.labHours?.weekends || ''}
                    onChange={(e) => handleLabHoursChange('weekends', e.target.value)}
                    placeholder="Weekends: By appointment only"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Equipment/Softwares</CardTitle>
                <CardDescription>
                  Manage your laboratory equipment/softwares list
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <Input
                      value={newEquipment}
                      onChange={(e) => setNewEquipment(e.target.value)}
                      placeholder="Enter equipment/software name"
                    />
                  </div>
                  <Button 
                    type="button"
                    onClick={handleAddEquipment}
                    className="bg-university-red hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                {formData.equipment && formData.equipment.length > 0 ? (
                  <ul className="space-y-2">
                    {formData.equipment.map((equipment, index) => (
                      <li 
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                      >
                        <span>{equipment}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEquipment(equipment)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No equipment added yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Research Areas</CardTitle>
                <CardDescription>
                  Manage your lab's research focus areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-4 mb-4">
                  <div className="flex-1">
                    <Input
                      value={newResearch}
                      onChange={(e) => setNewResearch(e.target.value)}
                      placeholder="Enter a research area"
                    />
                  </div>
                  <Button 
                    type="button"
                    onClick={handleAddResearch}
                    className="bg-university-red hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                {lab.research.length > 0 ? (
                  <ul className="space-y-2">
                    {lab.research.map((research, index) => (
                      <li 
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                      >
                        <span>{research}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveResearch(research)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No research areas added yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lab Members</CardTitle>
                <CardDescription>
                  Manage your laboratory members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-4 mb-4">
                  <div className="flex-1">
                    <Input
                      value={newMember}
                      onChange={(e) => setNewMember(e.target.value)}
                      placeholder="Enter member name and role"
                    />
                  </div>
                  <Button 
                    type="button"
                    onClick={handleAddMember}
                    className="bg-university-red hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                {lab.members.length > 0 ? (
                  <ul className="space-y-2">
                    {lab.members.map((member, index) => (
                      <li 
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                      >
                        <span>{member}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No lab members added yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-university-red hover:bg-red-700"
          >
            {isLoading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LabEditor;
