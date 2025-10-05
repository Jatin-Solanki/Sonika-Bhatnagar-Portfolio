import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Edit2, X, Check } from 'lucide-react';

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

type PublicationFormData = Omit<Publication, 'id'>;
type BookChapterFormData = Omit<BookChapter, 'id'>;

const PublicationsEditor: React.FC = () => {
  const { 
    publications, 
    bookChapters,
    addPublication, 
    updatePublication, 
    removePublication,
    addBookChapter,
    updateBookChapter,
    removeBookChapter
  } = useData();
  const { toast } = useToast();
  
  const [isAddingPublication, setIsAddingPublication] = useState(false);
  const [isAddingBookChapter, setIsAddingBookChapter] = useState(false);
  const [editingPublicationId, setEditingPublicationId] = useState<string | null>(null);
  const [editingBookChapterId, setEditingBookChapterId] = useState<string | null>(null);
  
  const emptyPublication: PublicationFormData = {
    title: '',
    authors: '',
    journal: '',
    year: '',
    url: ''
  };

  const emptyBookChapter: BookChapterFormData = {
    title: '',
    authors: '',
    bookTitle: '',
    editors: '',
    publisher: '',
    year: '',
    pages: '',
    url: ''
  };
  
  const [newPublication, setNewPublication] = useState<PublicationFormData>(emptyPublication);
  const [newBookChapter, setNewBookChapter] = useState<BookChapterFormData>(emptyBookChapter);
  const [editPublication, setEditPublication] = useState<Publication | null>(null);
  const [editBookChapter, setEditBookChapter] = useState<BookChapter | null>(null);

  const handleAddPublicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPublication.title || !newPublication.authors || !newPublication.journal || !newPublication.year) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    addPublication(newPublication);
    setNewPublication(emptyPublication);
    setIsAddingPublication(false);
    
    toast({
      title: "Publication added",
      description: "Your publication has been added successfully.",
    });
  };

  const handleAddBookChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBookChapter.title || !newBookChapter.authors || !newBookChapter.bookTitle || !newBookChapter.publisher || !newBookChapter.year) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    addBookChapter(newBookChapter);
    setNewBookChapter(emptyBookChapter);
    setIsAddingBookChapter(false);
    
    toast({
      title: "Book chapter added",
      description: "Your book chapter has been added successfully.",
    });
  };

  const handleEditPublicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editPublication) return;
    
    if (!editPublication.title || !editPublication.authors || !editPublication.journal || !editPublication.year) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const { id, ...data } = editPublication;
    updatePublication(id, data);
    setEditingPublicationId(null);
    setEditPublication(null);
    
    toast({
      title: "Publication updated",
      description: "Your publication has been updated successfully.",
    });
  };

  const handleEditBookChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editBookChapter) return;
    
    if (!editBookChapter.title || !editBookChapter.authors || !editBookChapter.bookTitle || !editBookChapter.publisher || !editBookChapter.year) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const { id, ...data } = editBookChapter;
    updateBookChapter(id, data);
    setEditingBookChapterId(null);
    setEditBookChapter(null);
    
    toast({
      title: "Book chapter updated",
      description: "Your book chapter has been updated successfully.",
    });
  };

  const handleRemovePublication = (id: string, title: string) => {
    removePublication(id);
    
    toast({
      title: "Publication removed",
      description: `"${title}" has been removed from your publications.`,
    });
  };

  const handleRemoveBookChapter = (id: string, title: string) => {
    removeBookChapter(id);
    
    toast({
      title: "Book chapter removed",
      description: `"${title}" has been removed from your book chapters.`,
    });
  };

  const startEditingPublication = (publication: Publication) => {
    setEditingPublicationId(publication.id);
    setEditPublication(publication);
  };

  const startEditingBookChapter = (chapter: BookChapter) => {
    setEditingBookChapterId(chapter.id);
    setEditBookChapter(chapter);
  };

  const cancelEditingPublication = () => {
    setEditingPublicationId(null);
    setEditPublication(null);
  };

  const cancelEditingBookChapter = () => {
    setEditingBookChapterId(null);
    setEditBookChapter(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Publications</h1>
      
      <Tabs defaultValue="publications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="publications">Research Publications</TabsTrigger>
          <TabsTrigger value="bookchapters">Book Chapters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="publications" className="space-y-6">
          {!isAddingPublication ? (
            <div className="mb-6">
              <Button 
                onClick={() => setIsAddingPublication(true)}
                className="bg-university-red hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Publication
              </Button>
            </div>
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Publication</CardTitle>
                <CardDescription>
                  Enter the details of your new publication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPublicationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                      <Input
                        id="title"
                        value={newPublication.title}
                        onChange={(e) => setNewPublication(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Publication title"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="authors">Authors <span className="text-red-500">*</span></Label>
                      <Input
                        id="authors"
                        value={newPublication.authors}
                        onChange={(e) => setNewPublication(prev => ({ ...prev, authors: e.target.value }))}
                        placeholder="Authors (e.g., Smith J., Johnson A.)"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="journal">Journal/Conference <span className="text-red-500">*</span></Label>
                      <Input
                        id="journal"
                        value={newPublication.journal}
                        onChange={(e) => setNewPublication(prev => ({ ...prev, journal: e.target.value }))}
                        placeholder="Journal or conference name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="year">Year <span className="text-red-500">*</span></Label>
                      <Input
                        id="year"
                        value={newPublication.year}
                        onChange={(e) => setNewPublication(prev => ({ ...prev, year: e.target.value }))}
                        placeholder="Publication year"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="url">URL (optional)</Label>
                      <Input
                        id="url"
                        type="url"
                        value={newPublication.url}
                        onChange={(e) => setNewPublication(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://doi.org/example"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingPublication(false);
                        setNewPublication(emptyPublication);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-university-red hover:bg-red-700"
                    >
                      Add Publication
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Your Publications</CardTitle>
              <CardDescription>
                Manage your research publications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {publications.length > 0 ? (
                <div className="space-y-4">
                  {publications.map((publication) => (
                    <div 
                      key={publication.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      {editingPublicationId === publication.id && editPublication ? (
                        <form onSubmit={handleEditPublicationSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`edit-title-${publication.id}`}>Title</Label>
                              <Input
                                id={`edit-title-${publication.id}`}
                                value={editPublication.title}
                                onChange={(e) => setEditPublication(prev => prev ? { ...prev, title: e.target.value } : null)}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`edit-authors-${publication.id}`}>Authors</Label>
                              <Input
                                id={`edit-authors-${publication.id}`}
                                value={editPublication.authors}
                                onChange={(e) => setEditPublication(prev => prev ? { ...prev, authors: e.target.value } : null)}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`edit-journal-${publication.id}`}>Journal/Conference</Label>
                              <Input
                                id={`edit-journal-${publication.id}`}
                                value={editPublication.journal}
                                onChange={(e) => setEditPublication(prev => prev ? { ...prev, journal: e.target.value } : null)}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`edit-year-${publication.id}`}>Year</Label>
                              <Input
                                id={`edit-year-${publication.id}`}
                                value={editPublication.year}
                                onChange={(e) => setEditPublication(prev => prev ? { ...prev, year: e.target.value } : null)}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`edit-url-${publication.id}`}>URL (optional)</Label>
                              <Input
                                id={`edit-url-${publication.id}`}
                                type="url"
                                value={editPublication.url || ''}
                                onChange={(e) => setEditPublication(prev => prev ? { ...prev, url: e.target.value } : null)}
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={cancelEditingPublication}
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
                            <h3 className="text-lg font-semibold">{publication.title}</h3>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditingPublication(publication)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePublication(publication.id, publication.title)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-1">{publication.authors}</p>
                          <p className="text-gray-600 italic mt-1">
                            {publication.journal}, {publication.year}
                          </p>
                          {publication.url && (
                            <div className="mt-2">
                              <a 
                                href={publication.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                              >
                                View Publication
                              </a>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven't added any publications yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookchapters" className="space-y-6">
          {!isAddingBookChapter ? (
            <div className="mb-6">
              <Button 
                onClick={() => setIsAddingBookChapter(true)}
                className="bg-university-red hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Book Chapter
              </Button>
            </div>
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Book Chapter</CardTitle>
                <CardDescription>
                  Enter the details of your new book chapter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBookChapterSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="chapter-title">Chapter Title <span className="text-red-500">*</span></Label>
                      <Input
                        id="chapter-title"
                        value={newBookChapter.title}
                        onChange={(e) => setNewBookChapter(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Chapter title"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="chapter-authors">Authors <span className="text-red-500">*</span></Label>
                      <Input
                        id="chapter-authors"
                        value={newBookChapter.authors}
                        onChange={(e) => setNewBookChapter(prev => ({ ...prev, authors: e.target.value }))}
                        placeholder="Authors (e.g., Smith J., Johnson A.)"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="book-title">Book Title <span className="text-red-500">*</span></Label>
                      <Input
                        id="book-title"
                        value={newBookChapter.bookTitle}
                        onChange={(e) => setNewBookChapter(prev => ({ ...prev, bookTitle: e.target.value }))}
                        placeholder="Book title"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="editors">Editors (optional)</Label>
                      <Input
                        id="editors"
                        value={newBookChapter.editors}
                        onChange={(e) => setNewBookChapter(prev => ({ ...prev, editors: e.target.value }))}
                        placeholder="Book editors"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="publisher">Publisher <span className="text-red-500">*</span></Label>
                      <Input
                        id="publisher"
                        value={newBookChapter.publisher}
                        onChange={(e) => setNewBookChapter(prev => ({ ...prev, publisher: e.target.value }))}
                        placeholder="Publisher name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chapter-year">Year <span className="text-red-500">*</span></Label>
                      <Input
                        id="chapter-year"
                        value={newBookChapter.year}
                        onChange={(e) => setNewBookChapter(prev => ({ ...prev, year: e.target.value }))}
                        placeholder="Publication year"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pages">Pages (optional)</Label>
                      <Input
                        id="pages"
                        value={newBookChapter.pages}
                        onChange={(e) => setNewBookChapter(prev => ({ ...prev, pages: e.target.value }))}
                        placeholder="e.g., 15-30"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chapter-url">URL (optional)</Label>
                      <Input
                        id="chapter-url"
                        type="url"
                        value={newBookChapter.url}
                        onChange={(e) => setNewBookChapter(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingBookChapter(false);
                        setNewBookChapter(emptyBookChapter);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-university-red hover:bg-red-700"
                    >
                      Add Book Chapter
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Your Book Chapters</CardTitle>
              <CardDescription>
                Manage your book chapters
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookChapters.length > 0 ? (
                <div className="space-y-4">
                  {bookChapters.map((chapter) => (
                    <div 
                      key={chapter.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      {editingBookChapterId === chapter.id && editBookChapter ? (
                        <form onSubmit={handleEditBookChapterSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`edit-chapter-title-${chapter.id}`}>Chapter Title <span className="text-red-500">*</span></Label>
                              <Input
                                id={`edit-chapter-title-${chapter.id}`}
                                value={editBookChapter.title}
                                onChange={(e) => setEditBookChapter(prev => prev ? { ...prev, title: e.target.value } : null)}
                                placeholder="Chapter title"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`edit-chapter-authors-${chapter.id}`}>Authors <span className="text-red-500">*</span></Label>
                              <Input
                                id={`edit-chapter-authors-${chapter.id}`}
                                value={editBookChapter.authors}
                                onChange={(e) => setEditBookChapter(prev => prev ? { ...prev, authors: e.target.value } : null)}
                                placeholder="Authors (e.g., Smith J., Johnson A.)"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`edit-book-title-${chapter.id}`}>Book Title <span className="text-red-500">*</span></Label>
                              <Input
                                id={`edit-book-title-${chapter.id}`}
                                value={editBookChapter.bookTitle}
                                onChange={(e) => setEditBookChapter(prev => prev ? { ...prev, bookTitle: e.target.value } : null)}
                                placeholder="Book title"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`edit-editors-${chapter.id}`}>Editors (optional)</Label>
                              <Input
                                id={`edit-editors-${chapter.id}`}
                                value={editBookChapter.editors || ''}
                                onChange={(e) => setEditBookChapter(prev => prev ? { ...prev, editors: e.target.value } : null)}
                                placeholder="Book editors"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`edit-publisher-${chapter.id}`}>Publisher <span className="text-red-500">*</span></Label>
                              <Input
                                id={`edit-publisher-${chapter.id}`}
                                value={editBookChapter.publisher}
                                onChange={(e) => setEditBookChapter(prev => prev ? { ...prev, publisher: e.target.value } : null)}
                                placeholder="Publisher name"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`edit-chapter-year-${chapter.id}`}>Year <span className="text-red-500">*</span></Label>
                              <Input
                                id={`edit-chapter-year-${chapter.id}`}
                                value={editBookChapter.year}
                                onChange={(e) => setEditBookChapter(prev => prev ? { ...prev, year: e.target.value } : null)}
                                placeholder="Publication year"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`edit-pages-${chapter.id}`}>Pages (optional)</Label>
                              <Input
                                id={`edit-pages-${chapter.id}`}
                                value={editBookChapter.pages || ''}
                                onChange={(e) => setEditBookChapter(prev => prev ? { ...prev, pages: e.target.value } : null)}
                                placeholder="e.g., 15-30"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`edit-chapter-url-${chapter.id}`}>URL (optional)</Label>
                              <Input
                                id={`edit-chapter-url-${chapter.id}`}
                                type="url"
                                value={editBookChapter.url || ''}
                                onChange={(e) => setEditBookChapter(prev => prev ? { ...prev, url: e.target.value } : null)}
                                placeholder="https://example.com"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={cancelEditingBookChapter}
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
                            <h3 className="text-lg font-semibold">{chapter.title}</h3>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditingBookChapter(chapter)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveBookChapter(chapter.id, chapter.title)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-1">{chapter.authors}</p>
                          <p className="text-gray-600 mt-1">
                            In: <span className="italic">{chapter.bookTitle}</span>
                            {chapter.editors && <span>, edited by {chapter.editors}</span>}
                          </p>
                          <p className="text-gray-600 mt-1">
                            {chapter.publisher}, {chapter.year}
                            {chapter.pages && <span>, pp. {chapter.pages}</span>}
                          </p>
                          {chapter.url && (
                            <div className="mt-2">
                              <a 
                                href={chapter.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                              >
                                View Chapter
                              </a>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You haven't added any book chapters yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PublicationsEditor;
