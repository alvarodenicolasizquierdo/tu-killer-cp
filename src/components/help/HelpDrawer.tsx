import { useState, useMemo } from 'react';
import { tagEvent } from '@/utils/clarityTracking';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HelpCircle,
  Search,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Clock,
  BookOpen,
  ExternalLink,
  TrendingUp,
  Zap,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import {
  screenHelpContext,
  contextualQuestions,
  knownIssues,
  recentChanges,
  roleSpecificTips,
  mockArticles,
  helpCategories,
} from '@/data/helpData';
import { AIAnswerPanel } from './AIAnswerPanel';

export function HelpDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiQuestion, setAIQuestion] = useState('');
  const location = useLocation();
  const { currentUser } = useUser();

  // Get context for current screen
  const screenContext = useMemo(() => {
    return screenHelpContext[location.pathname] || screenHelpContext['/'];
  }, [location.pathname]);

  // Get relevant questions for this screen
  const relevantQuestions = useMemo(() => {
    return contextualQuestions
      .filter(q => q.screenContext === location.pathname || q.screenContext === '/')
      .sort((a, b) => b.askedCount - a.askedCount)
      .slice(0, 5);
  }, [location.pathname]);

  // Get issues affecting this screen
  const relevantIssues = useMemo(() => {
    return knownIssues.filter(issue => 
      issue.affectedScreens.includes(location.pathname) && issue.status !== 'resolved'
    );
  }, [location.pathname]);

  // Get recent changes for this screen
  const relevantChanges = useMemo(() => {
    return recentChanges
      .filter(change => change.relatedScreens.includes(location.pathname))
      .slice(0, 3);
  }, [location.pathname]);

  // Get role-specific tips
  const roleTips = useMemo(() => {
    return roleSpecificTips[currentUser.role] || roleSpecificTips['buyer'];
  }, [currentUser.role]);

  // Search results
  const searchResults = useMemo<{ articles: typeof mockArticles; questions: typeof contextualQuestions } | null>(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    
    const matchingArticles = mockArticles.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );

    const matchingQuestions = contextualQuestions.filter(q =>
      q.question.toLowerCase().includes(query) ||
      q.answer.toLowerCase().includes(query)
    );

    return { articles: matchingArticles.slice(0, 3), questions: matchingQuestions.slice(0, 3) };
  }, [searchQuery]);

  const handleAskAI = (question: string) => {
    setAIQuestion(question);
    setShowAIPanel(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (open) tagEvent('help_drawer', 'open'); }}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground z-50"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[420px] sm:w-[480px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl ai-gradient flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-lg">Help & Support</SheetTitle>
              <p className="text-xs text-muted-foreground">
                {screenContext.title} • Context-aware help
              </p>
            </div>
          </div>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {showAIPanel ? (
            <AIAnswerPanel
              question={aiQuestion}
              screenContext={screenContext}
              onBack={() => setShowAIPanel(false)}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search help articles..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Search Results */}
                {searchResults && (searchResults.articles.length > 0 || searchResults.questions.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 space-y-2"
                  >
                    {searchResults.articles?.map(article => (
                      <Link
                        key={article.id}
                        to="/knowledge-hub"
                        onClick={() => setIsOpen(false)}
                        className="block p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{article.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6 line-clamp-1">
                          {article.summary}
                        </p>
                      </Link>
                    ))}
                    {searchResults.questions?.map(q => (
                      <button
                        key={q.id}
                        onClick={() => handleAskAI(q.question)}
                        className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-accent" />
                          <span className="text-sm">{q.question}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <ScrollArea className="flex-1">
                <Tabs defaultValue="context" className="p-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="context" className="text-xs">For This Page</TabsTrigger>
                    <TabsTrigger value="role" className="text-xs">For Your Role</TabsTrigger>
                    <TabsTrigger value="updates" className="text-xs">Updates</TabsTrigger>
                  </TabsList>

                  {/* Context Tab - Screen-specific help */}
                  <TabsContent value="context" className="space-y-4 mt-4">
                    {/* Tip of the Day */}
                    {screenContext.tipOfTheDay && (
                      <div className="p-3 rounded-lg bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb className="h-4 w-4 text-accent" />
                          <span className="text-xs font-medium text-accent">Tip for this page</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {screenContext.tipOfTheDay}
                        </p>
                      </div>
                    )}

                    {/* Common Questions */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        What people usually ask here
                      </h4>
                      <div className="space-y-1">
                        {relevantQuestions.map((q) => (
                          <button
                            key={q.id}
                            onClick={() => handleAskAI(q.question)}
                            className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm group-hover:text-primary transition-colors">
                                {q.question}
                              </span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-[10px]">
                                {q.confidence}% confident
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                Asked {q.askedCount} times
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Known Issues */}
                    {relevantIssues.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Known Issues
                        </h4>
                        <div className="space-y-2">
                          {relevantIssues.map((issue) => (
                            <div key={issue.id} className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{issue.title}</span>
                                <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                                  {issue.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{issue.description}</p>
                              {issue.workaround && (
                                <p className="text-xs text-amber-700 mt-1">
                                  <strong>Workaround:</strong> {issue.workaround}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ask AI */}
                    <div className="pt-2">
                      <Button
                        onClick={() => handleAskAI('')}
                        className="w-full ai-gradient border-0"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Ask AI about this page
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Role Tab */}
                  <TabsContent value="role" className="space-y-4 mt-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-2">Tips for your role</p>
                      <ul className="space-y-2">
                        {roleTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Quick Links by Category */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Browse by Topic</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(helpCategories).slice(0, 6).map(([key, cat]) => (
                          <Link
                            key={key}
                            to="/knowledge-hub"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <cat.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs">{cat.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link to="/knowledge-hub" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Open Knowledge Hub
                        </Button>
                      </Link>
                    </div>
                  </TabsContent>

                  {/* Updates Tab */}
                  <TabsContent value="updates" className="space-y-4 mt-4">
                    {/* Recent Changes */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Recent Changes
                      </h4>
                      <div className="space-y-2">
                        {recentChanges.slice(0, 5).map((change) => (
                          <div key={change.id} className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={change.type === 'feature' ? 'default' : 'secondary'}
                                className="text-[10px]"
                              >
                                {change.type}
                              </Badge>
                              <span className="text-sm font-medium">{change.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{change.description}</p>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {change.date}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </ScrollArea>

              {/* Footer */}
              <div className="p-4 border-t bg-muted/30">
                <div className="flex items-center justify-between">
                  <Link
                    to="/knowledge-hub"
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <BookOpen className="h-3 w-3" />
                    Knowledge Hub
                  </Link>
                  <span className="text-[10px] text-muted-foreground">
                    Can't find what you need? Ask AI
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
