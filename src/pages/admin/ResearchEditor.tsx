
import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

const ResearchEditor: React.FC = () => {
  const { researchInterests, addResearchInterest, removeResearchInterest } = useData();
  const { toast } = useToast();
  const [newInterest, setNewInterest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newInterest.trim()) {
      toast({
        title: "Error",
        description: "Please enter a research interest.",
        variant: "destructive",
      });
      return;
    }
    
    addResearchInterest(newInterest.trim());
    setNewInterest('');
    
    toast({
      title: "Research interest added",
      description: "Your research interest has been added successfully.",
    });
  };

  const handleRemove = (id: string, title: string) => {
    removeResearchInterest(id);
    
    toast({
      title: "Research interest removed",
      description: `"${title}" has been removed from your research interests.`,
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Research Interests</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Research Interest</CardTitle>
          <CardDescription>
            Add a new research topic or area of expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-end gap-4">
            <div className="flex-1">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Enter a research interest"
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
          <CardTitle>Current Research Interests</CardTitle>
          <CardDescription>
            Manage your existing research interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {researchInterests.length > 0 ? (
            <ul className="space-y-2">
              {researchInterests.map((interest) => (
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
              <p>You haven't added any research interests yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchEditor;
