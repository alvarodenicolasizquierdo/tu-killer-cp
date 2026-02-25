import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Clock,
  Users,
  ChevronRight,
  Sparkles,
  Edit3,
  Trash2,
  Send,
  FileEdit,
  CheckCircle2,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useDrafts, Draft } from '@/contexts/DraftsContext';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'ready':
      return { label: 'Ready to Publish', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    case 'in_review':
      return { label: 'In Review', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    default:
      return { label: 'Draft', color: 'bg-muted text-muted-foreground' };
  }
};

const getSourceIcon = (sourceType: string) => {
  switch (sourceType) {
    case 'sop': return 'SOP';
    case 'email': return 'Email';
    case 'webinar': return 'Webinar';
    case 'sme': return 'SME';
    default: return 'Other';
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffHours = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

export function DraftsTabContent() {
  const { drafts, updateDraft, deleteDraft, publishDraft } = useDrafts();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState('');
  const [editedSourceType, setEditedSourceType] = useState('');
  const { toast } = useToast();

  const filteredDrafts = drafts.filter(d => {
    const matchesSearch = d.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditDraft = (draft: Draft) => {
    setSelectedDraft(draft);
    setEditedAnswer(draft.answer);
    setEditedSourceType(draft.sourceType);
    setEditDialogOpen(true);
  };

  const handleSaveDraft = () => {
    if (!selectedDraft) return;
    
    updateDraft(selectedDraft.id, { 
      answer: editedAnswer, 
      sourceType: editedSourceType 
    });
    
    toast({
      title: "Draft updated",
      description: "Your changes have been saved.",
    });
    setEditDialogOpen(false);
  };

  const handlePublishDraft = (draft: Draft) => {
    publishDraft(draft.id);
    
    toast({
      title: "Answer published",
      description: (
        <div className="flex flex-col gap-1">
          <span>Answer added to knowledge base successfully.</span>
          <span className="text-xs text-muted-foreground">
            The AI will now use this answer for similar questions.
          </span>
        </div>
      ),
    });
  };

  const handleDeleteDraft = () => {
    if (!selectedDraft) return;
    
    deleteDraft(selectedDraft.id);
    
    toast({
      title: "Draft deleted",
      description: "The draft has been permanently removed.",
    });
    setDeleteDialogOpen(false);
    setSelectedDraft(null);
  };

  const handleMarkAsReady = (draft: Draft) => {
    updateDraft(draft.id, { status: 'ready' });
    
    toast({
      title: "Marked as ready",
      description: "Draft is now ready for publishing.",
    });
  };

  const draftCounts = {
    all: drafts.length,
    draft: drafts.filter(d => d.status === 'draft').length,
    in_review: drafts.filter(d => d.status === 'in_review').length,
    ready: drafts.filter(d => d.status === 'ready').length,
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('all')}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Drafts</p>
                <p className="text-2xl font-semibold">{draftCounts.all}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileEdit className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('draft')}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Draft</p>
                <p className="text-2xl font-semibold">{draftCounts.draft}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Edit3 className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('in_review')}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Review</p>
                <p className="text-2xl font-semibold">{draftCounts.in_review}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setStatusFilter('ready')}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ready to Publish</p>
                <p className="text-2xl font-semibold">{draftCounts.ready}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drafts List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Saved Drafts</CardTitle>
              <CardDescription>
                Draft answers awaiting review or publication to the knowledge base
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drafts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="ready">Ready to Publish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {filteredDrafts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileEdit className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No drafts found</p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'Try adjusting your search' : 'Saved drafts will appear here'}
                  </p>
                </div>
              ) : (
                filteredDrafts.map((draft, index) => {
                  const statusConfig = getStatusConfig(draft.status);
                  return (
                    <motion.div
                      key={draft.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn("text-[10px]", statusConfig.color)}>
                              {statusConfig.label}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              {getSourceIcon(draft.sourceType)}
                            </Badge>
                          </div>
                          <p className="font-medium">{draft.question}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {draft.answer}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {draft.createdBy}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Modified {formatTimeAgo(draft.lastModified)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditDraft(draft)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => {
                              setSelectedDraft(draft);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {draft.status === 'ready' ? (
                            <Button
                              size="sm"
                              className="ai-gradient border-0 gap-1.5"
                              onClick={() => handlePublishDraft(draft)}
                            >
                              <Send className="h-3.5 w-3.5" />
                              Publish
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5"
                              onClick={() => handleMarkAsReady(draft)}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Mark Ready
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Draft Answer</DialogTitle>
            <DialogDescription>
              Make changes to your draft answer before publishing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium">{selectedDraft?.question}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Answer</label>
              <Textarea
                placeholder="Provide a clear, comprehensive answer..."
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Source Type</label>
              <Select value={editedSourceType} onValueChange={setEditedSourceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sop">SOP / Guide</SelectItem>
                  <SelectItem value="email">Email Guidance</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                  <SelectItem value="sme">SME Knowledge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDraft}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Draft?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this draft answer. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDraft}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
