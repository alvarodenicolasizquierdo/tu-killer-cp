import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Search,
  Filter,
  ChevronRight,
  Sparkles,
  FileText,
  Mail,
  Video,
  BookOpen,
  ArrowUpRight,
  RefreshCw,
  FileEdit,
} from 'lucide-react';
import { DraftsTabContent } from '@/components/help/DraftsTabContent';
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
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useDrafts } from '@/contexts/DraftsContext';
import { useUser } from '@/contexts/UserContext';

// Mock data for unanswered questions
const unansweredQuestions = [
  {
    id: 'uq-1',
    question: 'How do I request a rush TRF approval for urgent orders?',
    askedBy: 'Sarah Chen',
    role: 'Buyer / QA Manager',
    screen: '/trfs',
    timestamp: '2026-02-04T08:30:00Z',
    frequency: 12,
    priority: 'high',
  },
  {
    id: 'uq-2',
    question: 'What happens if a supplier fails the same test twice?',
    askedBy: 'Mark Thompson',
    role: 'Technologist',
    screen: '/suppliers',
    timestamp: '2026-02-03T14:22:00Z',
    frequency: 8,
    priority: 'medium',
  },
  {
    id: 'uq-3',
    question: 'Can I bulk approve components from different styles?',
    askedBy: 'Hajra Malik',
    role: 'QA Manager',
    screen: '/components',
    timestamp: '2026-02-03T11:45:00Z',
    frequency: 5,
    priority: 'medium',
  },
  {
    id: 'uq-4',
    question: 'How do I export test results to PDF for auditors?',
    askedBy: 'Alvaro Garcia',
    role: 'Supplier Admin',
    screen: '/trfs/TRF-001',
    timestamp: '2026-02-02T16:10:00Z',
    frequency: 15,
    priority: 'high',
  },
  {
    id: 'uq-5',
    question: 'What is the difference between Gold and Silver self-approval?',
    askedBy: 'Karuka Patel',
    role: 'Testing House',
    screen: '/self-approval-levels',
    timestamp: '2026-02-02T09:30:00Z',
    frequency: 3,
    priority: 'low',
  },
];

// Mock data for AI confidence overrides
const confidenceOverrides = [
  {
    id: 'co-1',
    question: 'Why is my TRF stuck in pending?',
    aiAnswer: 'TRFs may be pending due to incomplete documentation or awaiting lab results.',
    smeAnswer: 'TRFs are pending when: 1) Missing GSW submission, 2) Awaiting component linkage, 3) Lab queue delay, or 4) Approval threshold not met. Check the TRF timeline for specific blockers.',
    aiConfidence: 65,
    overriddenBy: 'Leo Martinez',
    overrideDate: '2026-02-03T10:15:00Z',
    improvementNote: 'Added specific blocker categories',
  },
  {
    id: 'co-2',
    question: 'How do I link a component to multiple styles?',
    aiAnswer: 'Components can be linked through the component library.',
    smeAnswer: 'Navigate to Components > Select Component > Click "Link to Styles" > Multi-select styles from the dropdown. Maximum 50 styles per batch. Component must have Base approval to link to production styles.',
    aiConfidence: 72,
    overriddenBy: 'Emma Wilson',
    overrideDate: '2026-02-02T14:30:00Z',
    improvementNote: 'Added step-by-step instructions and limits',
  },
  {
    id: 'co-3',
    question: 'What tests are required for children\'s sleepwear?',
    aiAnswer: 'Children\'s sleepwear requires flammability testing.',
    smeAnswer: 'Per CFR 1615/1616: All children\'s sleepwear (sizes 0-14) requires: 1) Flammability testing, 2) Char length measurement, 3) Residual flame time. Additional UK requirements: BS 5722 compliance. Testing must be at an accredited lab.',
    aiConfidence: 78,
    overriddenBy: 'Leo Martinez',
    overrideDate: '2026-02-01T09:45:00Z',
    improvementNote: 'Added regulatory references and regional requirements',
  },
];

// KPI metrics
const kpiMetrics = {
  totalQuestions: 1247,
  answeredByAI: 1089,
  escalatedToSME: 158,
  avgConfidence: 87,
  overrideRate: 12.7,
  avgResponseTime: '1.2s',
  satisfactionRate: 94,
  weeklyTrend: '+5.2%',
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'medium': return 'bg-warning/10 text-warning border-warning/20';
    default: return 'bg-muted text-muted-foreground';
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

export default function HelpAdmin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<typeof unansweredQuestions[0] | null>(null);
  const [answerDraft, setAnswerDraft] = useState('');
  const [selectedSourceType, setSelectedSourceType] = useState('sop');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { addDraft, drafts } = useDrafts();
  const { currentUser } = useUser();

  const handleSaveAsDraft = () => {
    if (!selectedQuestion || !answerDraft.trim()) {
      toast({
        title: "Cannot save draft",
        description: "Please provide an answer before saving.",
        variant: "destructive",
      });
      return;
    }

    addDraft({
      question: selectedQuestion.question,
      answer: answerDraft,
      sourceType: selectedSourceType,
      createdBy: currentUser?.name || 'Current User',
      originalQuestionId: selectedQuestion.id,
      status: 'draft',
    });

    toast({
      title: "Draft saved",
      description: "Your answer has been saved to the Drafts tab.",
    });
    setDialogOpen(false);
    setAnswerDraft('');
    setSelectedSourceType('sop');
  };

  const handleAddToKnowledgeBase = () => {
    toast({
      title: "Answer added to knowledge base",
      description: "The AI will now use this answer for similar questions.",
    });
    setDialogOpen(false);
    setAnswerDraft('');
    setSelectedSourceType('sop');
  };

  const filteredQuestions = unansweredQuestions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || q.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Help & Support Admin</h1>
          <p className="text-muted-foreground">
            Monitor AI performance, review unanswered questions, and manage knowledge base
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Sync Knowledge Base
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Resolution Rate</p>
                <p className="text-2xl font-semibold">
                  {((kpiMetrics.answeredByAI / kpiMetrics.totalQuestions) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>{kpiMetrics.weeklyTrend} vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-semibold">{kpiMetrics.avgConfidence}%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <Progress value={kpiMetrics.avgConfidence} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SME Override Rate</p>
                <p className="text-2xl font-semibold">{kpiMetrics.overrideRate}%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {kpiMetrics.escalatedToSME} of {kpiMetrics.totalQuestions} questions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">User Satisfaction</p>
                <p className="text-2xl font-semibold">{kpiMetrics.satisfactionRate}%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ThumbsUp className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <ThumbsUp className="h-3 w-3 text-emerald-600" />
              <span className="text-xs text-muted-foreground">1,172 helpful</span>
              <ThumbsDown className="h-3 w-3 text-destructive ml-2" />
              <span className="text-xs text-muted-foreground">75 not helpful</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="unanswered" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unanswered" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Unanswered Questions
            <Badge variant="secondary" className="ml-1">{unansweredQuestions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="drafts" className="gap-2">
            <FileEdit className="h-4 w-4" />
            Drafts
            <Badge variant="secondary" className="ml-1">{drafts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="overrides" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            AI Overrides
            <Badge variant="secondary" className="ml-1">{confidenceOverrides.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="sources" className="gap-2">
            <FileText className="h-4 w-4" />
            Knowledge Sources
          </TabsTrigger>
        </TabsList>

        {/* Unanswered Questions Tab */}
        <TabsContent value="unanswered" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Questions Needing Answers</CardTitle>
                  <CardDescription>
                    Questions the AI couldn't answer with sufficient confidence
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {filteredQuestions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Dialog open={dialogOpen && selectedQuestion?.id === question.id} onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (open) setSelectedQuestion(question);
                      }}>
                        <DialogTrigger asChild>
                          <button
                            className="w-full text-left p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant="outline" 
                                    className={cn("text-[10px]", getPriorityColor(question.priority))}
                                  >
                                    {question.priority}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Asked {question.frequency}x
                                  </span>
                                </div>
                                <p className="font-medium">{question.question}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {question.askedBy} ({question.role})
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTimeAgo(question.timestamp)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <ArrowUpRight className="h-3 w-3" />
                                    {question.screen}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                            </div>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Add Answer to Knowledge Base</DialogTitle>
                            <DialogDescription>
                              This answer will be used by the AI to respond to similar questions.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="p-3 rounded-lg bg-muted">
                              <p className="text-sm font-medium">{selectedQuestion?.question}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Asked {selectedQuestion?.frequency}x • Last by {selectedQuestion?.askedBy}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Your Answer</label>
                              <Textarea
                                placeholder="Provide a clear, comprehensive answer..."
                                value={answerDraft}
                                onChange={(e) => setAnswerDraft(e.target.value)}
                                rows={5}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Source Type</label>
                              <Select value={selectedSourceType} onValueChange={setSelectedSourceType}>
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
                            <Button variant="outline" onClick={handleSaveAsDraft}>Save as Draft</Button>
                            <Button className="ai-gradient border-0" onClick={handleAddToKnowledgeBase}>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Add to Knowledge Base
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drafts Tab */}
        <TabsContent value="drafts" className="space-y-4">
          <DraftsTabContent />
        </TabsContent>

        {/* AI Overrides Tab */}
        <TabsContent value="overrides" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">SME Override History</CardTitle>
              <CardDescription>
                Cases where AI answers were corrected or enhanced by subject matter experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {confidenceOverrides.map((override, index) => (
                    <motion.div
                      key={override.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg border space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{override.question}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/20">
                              AI: {override.aiConfidence}% confident
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Overridden by {override.overriddenBy} • {formatTimeAgo(override.overrideDate)}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">
                          View Details
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle className="h-4 w-4 text-destructive" />
                            <span className="text-xs font-medium text-destructive">Original AI Answer</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{override.aiAnswer}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-600">SME Corrected Answer</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{override.smeAnswer}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-xs">
                          <span className="font-medium">Improvement:</span> {override.improvementNote}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Sources Tab */}
        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Email Archive</CardTitle>
                    <CardDescription>Historical support emails</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Emails</span>
                    <span className="font-medium">2,847</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Indexed Q&As</span>
                    <span className="font-medium">1,203</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync</span>
                    <span className="font-medium">2h ago</span>
                  </div>
                  <Progress value={85} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">85% coverage</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Video className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Webinar Library</CardTitle>
                    <CardDescription>Training session transcripts</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Webinars</span>
                    <span className="font-medium">48</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transcribed</span>
                    <span className="font-medium">45</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Key Topics</span>
                    <span className="font-medium">156</span>
                  </div>
                  <Progress value={94} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">94% transcribed</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">SOPs & Guides</CardTitle>
                    <CardDescription>Official documentation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Documents</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Indexed Sections</span>
                    <span className="font-medium">892</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">1d ago</span>
                  </div>
                  <Progress value={100} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">100% indexed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content Quality Metrics</CardTitle>
              <CardDescription>
                How well each source contributes to accurate AI answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { source: 'Email Archive', accuracy: 82, usage: 45, icon: Mail },
                  { source: 'Webinar Transcripts', accuracy: 91, usage: 28, icon: Video },
                  { source: 'SOPs & Guides', accuracy: 96, usage: 27, icon: BookOpen },
                ].map((item) => (
                  <div key={item.source} className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.source}</span>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-muted-foreground">
                            {item.usage}% of answers
                          </span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px]",
                              item.accuracy >= 90 
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                                : "bg-warning/10 text-warning border-warning/20"
                            )}
                          >
                            {item.accuracy}% accuracy
                          </Badge>
                        </div>
                      </div>
                      <Progress value={item.accuracy} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
