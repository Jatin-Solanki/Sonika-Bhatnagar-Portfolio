import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, DollarSign, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const FinancialSupportEditor: React.FC = () => {
  const { financialSupports, addFinancialSupport, updateFinancialSupport, removeFinancialSupport, isLoading } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupport, setEditingSupport] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    fundReceived: '',
    duration: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    try {
      if (editingSupport) {
        await updateFinancialSupport(editingSupport.id, formData);
      } else {
        await addFinancialSupport(formData);
      }
      
      setFormData({ title: '', fundReceived: '', duration: '' });
      setEditingSupport(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving financial support:', error);
    }
  };

  const handleEdit = (support: any) => {
    setEditingSupport(support);
    setFormData({
      title: support.title,
      fundReceived: support.fundReceived,
      duration: support.duration
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this financial support record?')) {
      await removeFinancialSupport(id);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', fundReceived: '', duration: '' });
    setEditingSupport(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="bg-white rounded-lg p-6">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <DollarSign className="w-8 h-8 mr-3" />
          Financial Support Management
        </h1>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Financial Support
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSupport ? 'Edit Financial Support' : 'Add New Financial Support'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter grant/support title"
                />
              </div>
              <div>
                <Label htmlFor="fundReceived">Fund Received</Label>
                <Input
                  id="fundReceived"
                  value={formData.fundReceived}
                  onChange={(e) => setFormData({ ...formData, fundReceived: e.target.value })}
                  placeholder="Enter amount (e.g., $50,000)"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Enter duration (e.g., 2022-2024)"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSupport ? 'Update' : 'Add'} Financial Support
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Support List</CardTitle>
        </CardHeader>
        <CardContent>
          {financialSupports.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No financial support records added yet. Click "Add Financial Support" to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Fund Received</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialSupports.map((support) => (
                  <TableRow key={support.id}>
                    <TableCell className="font-medium">{support.title}</TableCell>
                    <TableCell>{support.fundReceived}</TableCell>
                    <TableCell>{support.duration}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(support)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(support.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSupportEditor;