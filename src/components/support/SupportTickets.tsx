import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
  Calendar,
  User,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { format } from 'date-fns';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  assignee?: string;
  messages: number;
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Cannot export TRF reports to PDF',
    description: 'When clicking export, the page loads indefinitely without generating the PDF.',
    status: 'in_progress',
    priority: 'high',
    category: 'Reports & Exports',
    createdBy: 'Sarah Chen',
    createdAt: '2026-02-03T14:30:00Z',
    updatedAt: '2026-02-04T09:15:00Z',
    assignee: 'THT Support',
    messages: 3,
  },
  {
    id: 'TKT-002',
    title: 'Component linking not working for bulk styles',
    description: 'Unable to link components to more than 10 styles at once.',
    status: 'open',
    priority: 'medium',
    category: 'Components',
    createdBy: 'Sarah Chen',
    createdAt: '2026-02-02T11:00:00Z',
    updatedAt: '2026-02-02T11:00:00Z',
    messages: 1,
  },
  {
    id: 'TKT-003',
    title: 'Question about flammability testing requirements',
    description: 'Need clarification on UK vs US requirements for children sleepwear.',
    status: 'resolved',
    priority: 'low',
    category: 'Testing & Compliance',
    createdBy: 'Sarah Chen',
    createdAt: '2026-01-28T16:45:00Z',
    updatedAt: '2026-01-30T10:20:00Z',
    assignee: 'Leo Martinez',
    messages: 5,
  },
];

const getStatusIcon = (status: Ticket['status']) => {
  switch (status) {
    case 'open': return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case 'in_progress': return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
    case 'resolved': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case 'closed': return <CheckCircle2 className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusLabel = (status: Ticket['status']) => {
  switch (status) {
    case 'open': return 'Open';
    case 'in_progress': return 'In Progress';
    case 'resolved': return 'Resolved';
    case 'closed': return 'Closed';
  }
};

const getPriorityBadge = (priority: Ticket['priority']) => {
  switch (priority) {
    case 'high': return <Badge variant="destructive" className="text-xs">High</Badge>;
    case 'medium': return <Badge variant="secondary" className="text-xs">Medium</Badge>;
    case 'low': return <Badge variant="outline" className="text-xs">Low</Badge>;
  }
};

export function SupportTickets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as Ticket['priority'],
  });
  const { toast } = useToast();
  const { currentUser } = useUser();

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTicket = () => {
    if (!newTicket.title.trim() || !newTicket.description.trim() || !newTicket.category) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const ticket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      title: newTicket.title,
      description: newTicket.description,
      status: 'open',
      priority: newTicket.priority,
      category: newTicket.category,
      createdBy: currentUser?.name || 'User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: 0,
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ title: '', description: '', category: '', priority: 'medium' });
    setCreateDialogOpen(false);
    
    toast({
      title: 'Ticket created',
      description: `Ticket ${ticket.id} has been submitted to THT Support.`,
    });
  };

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-semibold">{stats.open}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-semibold">{stats.inProgress}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-semibold">{stats.resolved}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue and our support team will assist you.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief summary of your issue"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail, including steps to reproduce..."
                  rows={4}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newTicket.category} onValueChange={(v) => setNewTicket({ ...newTicket, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Reports & Exports">Reports & Exports</SelectItem>
                      <SelectItem value="Testing & Compliance">Testing & Compliance</SelectItem>
                      <SelectItem value="Components">Components</SelectItem>
                      <SelectItem value="TRFs">TRFs</SelectItem>
                      <SelectItem value="Account & Access">Account & Access</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={newTicket.priority} onValueChange={(v) => setNewTicket({ ...newTicket, priority: v as Ticket['priority'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTicket}>
                Submit Ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tickets List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="divide-y">
              {filteredTickets.map((ticket, index) => (
                <motion.button
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="w-full text-left p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(ticket.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{ticket.title}</span>
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                          {ticket.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span className="font-mono">{ticket.id}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                          </span>
                          {ticket.assignee && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {ticket.assignee}
                            </span>
                          )}
                          {ticket.messages > 0 && (
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {ticket.messages}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getStatusLabel(ticket.status)}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">No tickets found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search or filters.' : 'Create a ticket to get help from THT Support.'}
          </p>
        </div>
      )}
    </div>
  );
}
