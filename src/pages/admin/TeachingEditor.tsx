
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

const TeachingEditor: React.FC = () => {
  const { teachingInterests, addTeachingInterest, removeTeachingInterest } = useData();
  const { toast } = useToast();
  const [newInterest, setNewInterest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newInterest.trim()) {
      toast({
        title: "Error",
        description: "Please enter a teaching interest.",
        variant: "destructive",
      });
      return;
    }
    
    addTeachingInterest(newInterest.trim());
    setNewInterest('');
    
    toast({
      title: "Teaching interest added",
      description: "Your teaching interest has been added successfully.",
    });
  };

  const handleRemove = (id: string, title: string) => {
    removeTeachingInterest(id);
    
    toast({
      title: "Teaching interest removed",
      description: `"${title}" has been removed from your teaching interests.`,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teaching Interests</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Teaching Interest</CardTitle>
          <CardDescription>
            Add a new course, subject or teaching area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-end gap-4">
            <div className="flex-1">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Enter a teaching interest"
              />
            </div>
            <Button 
              type="submit"
              className="bg-university-red hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Teaching Interests</CardTitle>
          <CardDescription>
            Manage your existing teaching interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teachingInterests.length > 0 ? (
            <ul className="space-y-2">
              {teachingInterests.map((interest) => (
                <li 
                  key={interest.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                >
                  <span>{interest.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(interest.id, interest.title)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>You haven't added any teaching interests yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeachingEditor;
