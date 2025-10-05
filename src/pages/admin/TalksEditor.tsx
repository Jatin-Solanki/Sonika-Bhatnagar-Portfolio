
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Edit2, X, Check } from 'lucide-react';

type Talk = {
  id: string;
  title: string;
  venue: string;
  date: string;
  description?: string;
};

type TalkFormData = Omit<Talk, 'id'>;

const TalksEditor: React.FC = () => {
  const { talks, addTalk, updateTalk, removeTalk } = useData();
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const emptyTalk: TalkFormData = {
    title: '',
    venue: '',
    date: '',
    description: ''
  };
  
  const [newTalk, setNewTalk] = useState<TalkFormData>(emptyTalk);
  const [editTalk, setEditTalk] = useState<Talk | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTalk(newTalk);
    setNewTalk(emptyTalk);
    setIsAdding(false);
    
    toast({
      title: "Talk added",
      description: "Your invited talk has been added successfully.",
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editTalk) return;
    
    const { id, ...data } = editTalk;
    updateTalk(id, data);
    setEditingId(null);
    setEditTalk(null);
    
    toast({
      title: "Talk updated",
      description: "Your invited talk has been updated successfully.",
    });
  };

  const handleRemove = (id: string, title: string) => {
    removeTalk(id);
    
    toast({
      title: "Talk removed",
      description: `"${title}" has been removed from your invited talks.`,
    });
  };

  const startEditing = (talk: Talk) => {
    setEditingId(talk.id);
    setEditTalk(talk);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTalk(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Invited Talks</h1>
      
      {!isAdding ? (
        <div className="mb-6">
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-university-red hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Talk
          </Button>
        </div>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Invited Talk</CardTitle>
            <CardDescription>
              Enter the details of your invited talk or presentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTalk.title}
                    onChange={(e) => setNewTalk(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Talk title"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="venue">Venue/Conference</Label>
                  <Input
                    id="venue"
                    value={newTalk.venue}
                    onChange={(e) => setNewTalk(prev => ({ ...prev, venue: e.target.value }))}
                    placeholder="Venue or conference name"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    value={newTalk.date}
                    onChange={(e) => setNewTalk(prev => ({ ...prev, date: e.target.value }))}
                    placeholder="e.g., March 15, 2024"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={newTalk.description || ''}
                    onChange={(e) => setNewTalk(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your talk"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewTalk(emptyTalk);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-university-red hover:bg-red-700"
                >
                  Add Talk
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Your Invited Talks</CardTitle>
          <CardDescription>
            Manage your presentations and invited talks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {talks.length > 0 ? (
            <div className="space-y-4">
              {talks.map((talk) => (
                <div 
                  key={talk.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  {editingId === talk.id && editTalk ? (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`edit-title-${talk.id}`}>Title</Label>
                          <Input
                            id={`edit-title-${talk.id}`}
                            value={editTalk.title}
                            onChange={(e) => setEditTalk(prev => prev ? { ...prev, title: e.target.value } : null)}
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`edit-venue-${talk.id}`}>Venue/Conference</Label>
                          <Input
                            id={`edit-venue-${talk.id}`}
                            value={editTalk.venue}
                            onChange={(e) => setEditTalk(prev => prev ? { ...prev, venue: e.target.value } : null)}
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`edit-date-${talk.id}`}>Date</Label>
                          <Input
                            id={`edit-date-${talk.id}`}
                            value={editTalk.date}
                            onChange={(e) => setEditTalk(prev => prev ? { ...prev, date: e.target.value } : null)}
                            placeholder="e.g., March 15, 2024"
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`edit-description-${talk.id}`}>Description (optional)</Label>
                          <Textarea
                            id={`edit-description-${talk.id}`}
                            value={editTalk.description || ''}
                            onChange={(e) => setEditTalk(prev => prev ? { ...prev, description: e.target.value } : null)}
                            rows={3}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelEditing}
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
                        <h3 className="text-lg font-semibold">{talk.title}</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(talk)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(talk.id, talk.title)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-1">{talk.venue}</p>
                      <p className="text-gray-600 mt-1">{talk.date}</p>
                      {talk.description && (
                        <p className="text-gray-700 mt-2 text-sm">{talk.description}</p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't added any invited talks yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TalksEditor;