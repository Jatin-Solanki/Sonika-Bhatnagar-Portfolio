
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { X, Plus, Edit2, Save } from 'lucide-react';

type ExperienceFormData = {
  title: string;
  company: string;
  location: string;
  startdate: string;
  enddate: string;
  description: string;
};

const ExperienceEditor: React.FC = () => {
  const { experiences, addExperience, updateExperience, removeExperience } = useData();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExperienceFormData>({
    title: '',
    company: '',
    location: '',
    startdate: '',
    enddate: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      startdate: '',
      enddate: '',
      description: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create experience data object, only including non-empty fields
    const experienceData: any = {};
    
    if (formData.title.trim()) {
      experienceData.title = formData.title.trim();
    }
    if (formData.company.trim()) {
      experienceData.company = formData.company.trim();
    }
    if (formData.location.trim()) {
      experienceData.location = formData.location.trim();
    }
    if (formData.startdate.trim()) {
      experienceData.startdate = formData.startdate.trim();
    }
    if (formData.enddate.trim()) {
      experienceData.enddate = formData.enddate.trim();
    }
    if (formData.description.trim()) {
      experienceData.description = formData.description.trim();
    }

    if (editingId) {
      await updateExperience(editingId, experienceData);
      setEditingId(null);
    } else {
      await addExperience(experienceData);
      setIsAddDialogOpen(false);
    }
    
    resetForm();
  };

  const handleEdit = (experience: any) => {
    setFormData({
      title: experience.title || '',
      company: experience.company || '',
      location: experience.location || '',
      startdate: experience.startdate || '',
      enddate: experience.enddate || '',
      description: experience.description || ''
    });
    setEditingId(experience.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const handleRemove = async (id: string, title: string) => {
    await removeExperience(id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Experience</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Experience</CardTitle>
          <CardDescription>
            Add your work experience, internships, or professional positions. All fields are optional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-university-red hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Experience</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title (Optional)</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="e.g., Google Inc."
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startdate">Start Date (Optional)</Label>
                    <Input
                      id="startdate"
                      name="startdate"
                      value={formData.startdate}
                      onChange={handleChange}
                      placeholder="e.g., January 2020"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="enddate">End Date (Optional)</Label>
                    <Input
                      id="enddate"
                      name="enddate"
                      value={formData.enddate}
                      onChange={handleChange}
                      placeholder="e.g., December 2022 (leave empty if current)"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-university-red hover:bg-red-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Experience</CardTitle>
          <CardDescription>
            Manage your existing work experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          {experiences.length > 0 ? (
            <div className="space-y-6">
              {experiences.map((experience) => (
                <div key={experience.id} className="border rounded-lg p-4">
                  {editingId === experience.id ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Job Title (Optional)</Label>
                          <Input
                            id="edit-title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-company">Company (Optional)</Label>
                          <Input
                            id="edit-company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-location">Location (Optional)</Label>
                        <Input
                          id="edit-location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-startdate">Start Date (Optional)</Label>
                          <Input
                            id="edit-startdate"
                            name="startdate"
                            value={formData.startdate}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-enddate">End Date (Optional)</Label>
                          <Input
                            id="edit-enddate"
                            name="enddate"
                            value={formData.enddate}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-description">Description (Optional)</Label>
                        <Textarea
                          id="edit-description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-university-red hover:bg-red-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{experience.title || 'Untitled Position'}</h3>
                          <p className="text-gray-600 font-medium">{experience.company || 'Company not specified'}</p>
                          {experience.location && (
                            <p className="text-gray-500 text-sm">{experience.location}</p>
                          )}
                          <p className="text-gray-500 text-sm">
                            {experience.startdate || 'Start date not specified'} - {experience.enddate || 'Present'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(experience)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(experience.id, experience.title)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {experience.description && (
                        <p className="text-gray-700 text-sm leading-relaxed">{experience.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't added any experience yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExperienceEditor;
