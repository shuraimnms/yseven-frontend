import { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  Filter, 
  Search,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Building,
  Globe,
  FileText,
  Newspaper,
  Package,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import SEO from '@/components/SEO';
import { generateSEO } from '@/lib/seo';
import { authApiFetch } from '@/utils/apiUtils';

interface Contact {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'general' | 'bulk' | 'partnership' | 'support' | 'media' | 'export' | 'press' | 'chat';
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactStats {
  overview: {
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  recentCount: number;
}

export default function ContactRequests() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);

  // Edit form
  const [editForm, setEditForm] = useState({
    status: '',
    priority: '',
    notes: ''
  });

  const typeIcons = {
    general: MessageSquare,
    bulk: Package,
    partnership: Users,
    support: AlertCircle,
    media: Newspaper,
    export: Globe,
    press: FileText,
    chat: MessageSquare
  };

  const statusColors = {
    new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
    closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };

  const priorityColors = {
    low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    urgent: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);

      const response = await fetch(`/api/v1/contact?${params}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.data?.contacts || data.data || []);
        setTotalPages(data.data?.pagination?.pages || 1);
        setTotalContacts(data.data?.pagination?.total || 0);
      } else {
        console.error('API Error:', response.status, response.statusText);
        toast({
          title: 'Error',
          description: `Failed to fetch contact requests: ${response.status}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch contact requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await authApiFetch('/contact/stats');

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else {
        console.error('Stats API Error:', response.status, response.statusText);
        toast({
          title: 'Error',
          description: `Failed to fetch statistics: ${response.status}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateContact = async () => {
    if (!selectedContact) return;

    try {
      const response = await fetch(`/api/v1/contact/${selectedContact._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Contact updated successfully',
        });
        setIsEditDialogOpen(false);
        fetchContacts();
        fetchStats();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Error',
          description: errorData.message || 'Failed to update contact',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to update contact',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact request?')) return;

    try {
      const response = await fetch(`/api/v1/contact/${contactId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Contact deleted successfully',
        });
        fetchContacts();
        fetchStats();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Error',
          description: errorData.message || 'Failed to delete contact',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive',
      });
    }
  };

  const openViewDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setEditForm({
      status: contact.status,
      priority: contact.priority,
      notes: contact.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      (contact.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [currentPage, statusFilter, typeFilter, priorityFilter]);

  const seoData = generateSEO({
    title: 'Contact Requests - Y7 Sauces Admin',
    description: 'Manage customer inquiries, support requests, and business communications.',
  });

  return (
    <>
      <SEO {...seoData} />
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cream">Contact Requests</h1>
            <p className="text-cream/60">Manage customer inquiries and messages</p>
          </div>
          <Button 
            onClick={() => { fetchContacts(); fetchStats(); }}
            variant="outline" 
            size="sm" 
            className="border-gold/30 text-cream hover:bg-gold/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-charcoal border-gold/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cream/60 text-sm font-medium">Total Requests</p>
                    <p className="text-2xl font-bold text-cream mt-1">{stats.overview.total}</p>
                  </div>
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-charcoal border-gold/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cream/60 text-sm font-medium">New</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">{stats.overview.new}</p>
                  </div>
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-charcoal border-gold/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cream/60 text-sm font-medium">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.overview.inProgress}</p>
                  </div>
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-charcoal border-gold/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cream/60 text-sm font-medium">Resolved</p>
                    <p className="text-2xl font-bold text-green-400 mt-1">{stats.overview.resolved}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-charcoal border-gold/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cream/60 text-sm font-medium">Recent (7 days)</p>
                    <p className="text-2xl font-bold text-purple-400 mt-1">{stats.recentCount}</p>
                  </div>
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="bg-charcoal border-gold/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/40 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-obsidian border-gold/20 text-cream"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 bg-obsidian border-gold/20 text-cream">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-40 bg-obsidian border-gold/20 text-cream">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="bulk">Bulk Orders</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="press">Press</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-40 bg-obsidian border-gold/20 text-cream">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contact Requests Table */}
        <Card className="bg-charcoal border-gold/20">
          <CardHeader>
            <CardTitle className="text-cream">Contact Requests ({totalContacts})</CardTitle>
            <CardDescription>Customer inquiries and support requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContacts.map((contact) => {
                  const TypeIcon = typeIcons[contact.type];
                  return (
                    <div key={contact._id} className="border border-gold/10 rounded-lg p-4 hover:bg-obsidian/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex-shrink-0">
                            <TypeIcon className="w-6 h-6 text-cream/60" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-cream">{contact.fullName || 'N/A'}</h3>
                              <Badge className={cn('font-medium', statusColors[contact.status || 'new'])}>
                                {(contact.status || 'new').replace('-', ' ')}
                              </Badge>
                              <Badge className={cn('font-medium', priorityColors[contact.priority || 'medium'])}>
                                {contact.priority || 'medium'}
                              </Badge>
                              <Badge variant="outline" className="capitalize border-gold/30 text-cream/80">
                                {contact.type || 'general'}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-cream/80 mb-1 font-medium">{contact.email || 'N/A'}</p>
                            {contact.phone && (
                              <p className="text-sm text-cream/80 mb-1 font-medium">{contact.phone}</p>
                            )}
                            
                            <p className="font-semibold text-cream mb-2">{contact.subject || 'No Subject'}</p>
                            <p className="text-sm text-cream/70 line-clamp-2">{contact.message || 'No message'}</p>
                            
                            <div className="flex items-center space-x-4 mt-2 text-xs text-cream/60">
                              <span className="flex items-center font-medium">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(contact.createdAt).toLocaleDateString('en-IN')}
                              </span>
                              {contact.assignedTo && (
                                <span className="flex items-center font-medium">
                                  <User className="w-3 h-3 mr-1" />
                                  {contact.assignedTo.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openViewDialog(contact)}
                            className="border-gold/30 text-cream hover:bg-gold/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(contact)}
                            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContact(contact._id)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredContacts.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-cream/40 mx-auto mb-4" />
                    <p className="text-cream/60 font-medium">No contact requests found</p>
                    <p className="text-cream/40 text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-gold/30 text-cream hover:bg-gold/10"
                >
                  Previous
                </Button>
                
                <span className="flex items-center px-4 py-2 text-sm text-cream font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-gold/30 text-cream hover:bg-gold/10"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl bg-charcoal border-gold/20">
            <DialogHeader>
              <DialogTitle className="text-cream">Contact Request Details</DialogTitle>
            </DialogHeader>
            
            {selectedContact && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-cream/80">Name</label>
                    <p className="text-cream font-medium">{selectedContact.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-cream/80">Email</label>
                    <p className="text-cream font-medium">{selectedContact.email || 'N/A'}</p>
                  </div>
                </div>
                
                {selectedContact.phone && (
                  <div>
                    <label className="text-sm font-semibold text-cream/80">Phone</label>
                    <p className="text-cream font-medium">{selectedContact.phone}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-semibold text-cream/80">Subject</label>
                  <p className="text-cream font-medium">{selectedContact.subject || 'No Subject'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-cream/80">Message</label>
                  <p className="text-cream whitespace-pre-wrap">{selectedContact.message || 'No message'}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-cream/80">Type</label>
                    <Badge variant="outline" className="capitalize border-gold/30 text-cream/80">
                      {selectedContact.type || 'general'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-cream/80">Status</label>
                    <Badge className={cn('font-medium', statusColors[selectedContact.status || 'new'])}>
                      {(selectedContact.status || 'new').replace('-', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-cream/80">Priority</label>
                    <Badge className={cn('font-medium', priorityColors[selectedContact.priority || 'medium'])}>
                      {selectedContact.priority || 'medium'}
                    </Badge>
                  </div>
                </div>
                
                {selectedContact.notes && (
                  <div>
                    <label className="text-sm font-semibold text-cream/80">Notes</label>
                    <p className="text-cream whitespace-pre-wrap">{selectedContact.notes}</p>
                  </div>
                )}
                
                <div className="text-sm text-cream/60 font-medium">
                  <p>Created: {new Date(selectedContact.createdAt).toLocaleString('en-IN')}</p>
                  <p>Updated: {new Date(selectedContact.updatedAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-charcoal border-gold/20">
            <DialogHeader>
              <DialogTitle className="text-cream">Update Contact Request</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-cream/80">Status</label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-obsidian border-gold/20 text-cream">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-cream/80">Priority</label>
                <Select value={editForm.priority} onValueChange={(value) => setEditForm(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="bg-obsidian border-gold/20 text-cream">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-cream/80">Notes</label>
                <Textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add internal notes..."
                  rows={4}
                  className="bg-obsidian border-gold/20 text-cream"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-gold/30 text-cream hover:bg-gold/10"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateContact}
                  className="bg-gold hover:bg-gold/80 text-obsidian"
                >
                  Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}