import { useState, useRef, useEffect } from 'react';
import { tagScreen, tagEvent } from '@/utils/clarityTracking';
import { chatMessageToSafeHtml, markdownToSafeHtml } from '@/lib/sanitize';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  BookOpen,
  Ticket,
  ShieldCheck,
  Search,
  Eye,
  Clock,
  Video,
  Mail,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/types';
import { aiDemoResponses } from '@/data/mockData';
import { useUser } from '@/contexts/UserContext';
import {
  mockArticles,
  helpCategories,
  HelpCategory,
  HelpArticle,
} from '@/data/helpData';
import { SupportTickets } from '@/components/support/SupportTickets';

// Import the HelpAdmin content
import HelpAdminContent from './HelpAdmin';

const suggestedQueries = [
  "How do I submit a TRF?",
  "Why is my component stuck pending?",
  "Export test results to PDF",
  "Flammability testing requirements"
];

// Ask Carlos Tab Content
function AskCarlosTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm CARLOS, your AI-powered support assistant. I can help you with:\n\n• **How-to questions** - "How do I submit a TRF?"\n• **Troubleshooting** - "Why is my component stuck pending?"\n• **Documentation** - "What tests are required for children's sleepwear?"\n• **Quick guides** - "Export test results to PDF"\n\nWhat can I help you with today?`,
      timestamp: new Date().toISOString(),
      suggestions: suggestedQueries
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerMessage = message.toLowerCase();
      let responseData = aiDemoResponses.default;

      if (lowerMessage.includes('trf') || lowerMessage.includes('submit')) {
        responseData = {
          response: "To submit a TRF:\n\n1. Navigate to **TRFs** from the sidebar\n2. Click **+ New TRF** button\n3. Fill in the product details and select tests\n4. Attach required documents\n5. Click **Submit for Review**\n\nThe TRF will be sent to the lab queue for processing.",
          suggestions: ["What documents are required?", "How long does review take?", "Track my TRF status"]
        };
      } else if (lowerMessage.includes('pending') || lowerMessage.includes('stuck')) {
        responseData = {
          response: "Components may be stuck pending due to:\n\n• **Missing documentation** - Check if all required docs are uploaded\n• **Awaiting approval** - Review the approval workflow status\n• **Lab queue delay** - Check lab capacity in the dashboard\n\nWould you like me to help you diagnose the specific issue?",
          suggestions: ["Check my pending items", "Escalate to support", "View approval workflow"]
        };
      } else if (lowerMessage.includes('export') || lowerMessage.includes('pdf')) {
        responseData = {
          response: "To export test results to PDF:\n\n1. Open the TRF or test report you want to export\n2. Click the **Export** button in the top-right\n3. Select **PDF** from the format options\n4. Choose which sections to include\n5. Click **Download**\n\nThe PDF will include all test results, certificates, and compliance stamps.",
          suggestions: ["Export multiple TRFs", "Customize PDF template", "Share report via email"]
        };
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseData.response,
        timestamp: new Date().toISOString(),
        suggestions: responseData.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <Card className="h-[calc(100vh-280px)] flex flex-col overflow-hidden">
      <div className="p-4 border-b bg-gradient-to-r from-ai-primary/5 to-ai-secondary/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl ai-gradient flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">Ask Carlos</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              AI-powered support • Instant answers
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 max-w-3xl mx-auto">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-3", message.role === 'user' && "flex-row-reverse")}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  message.role === 'assistant' ? "ai-gradient" : "bg-primary"
                )}>
                  {message.role === 'assistant' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>

                <div className={cn("max-w-[80%] space-y-2", message.role === 'user' && "items-end")}>
                  <div className={cn(message.role === 'assistant' ? "ai-bubble" : "user-bubble")}>
                    <div 
                      className={cn(
                        "text-sm prose prose-sm max-w-none",
                        message.role === 'user' && "text-primary-foreground prose-invert"
                      )}
                      dangerouslySetInnerHTML={{ 
                        __html: chatMessageToSafeHtml(message.content)
                      }}
                    />
                  </div>

                  {message.suggestions && message.role === 'assistant' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.suggestions.map((suggestion, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleSend(suggestion)}
                        >
                          {suggestion}
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      ))}
                    </div>
                  )}

                  {message.role === 'assistant' && index > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Was this helpful?</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg ai-gradient flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="ai-bubble">
                <div className="flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin text-ai-primary" />
                  <span className="text-sm text-muted-foreground">Carlos is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex items-center gap-2 max-w-3xl mx-auto"
        >
          <Input
            placeholder="Ask Carlos anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="submit" 
            className="ai-gradient border-0 shrink-0"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Carlos searches knowledge articles first. Can't find an answer? Create a support ticket.
        </p>
      </div>
    </Card>
  );
}

// Knowledge Hub Tab Content
function KnowledgeHubTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HelpCategory | 'all'>('all');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  const filteredArticles = (() => {
    let articles = mockArticles;
    if (selectedCategory !== 'all') {
      articles = articles.filter(a => a.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query) ||
        a.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return articles.sort((a, b) => b.viewCount - a.viewCount);
  })();

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'webinar': return Video;
      case 'guide': return BookOpen;
      case 'sop': return FileText;
      default: return Sparkles;
    }
  };

  if (selectedArticle) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <button onClick={() => setSelectedArticle(null)} className="hover:text-primary transition-colors">
            Knowledge Hub
          </button>
          <ChevronRight className="h-4 w-4" />
          <span>{helpCategories[selectedArticle.category].label}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{selectedArticle.title}</span>
        </div>

        <Card>
          <CardContent className="p-6">
            <Badge variant="secondary" className="mb-2">
              {helpCategories[selectedArticle.category].label}
            </Badge>
            <h2 className="text-xl font-semibold mb-2">{selectedArticle.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{selectedArticle.summary}</p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {selectedArticle.viewCount} views
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                {selectedArticle.helpfulCount} found helpful
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Updated {selectedArticle.lastUpdated}
              </span>
            </div>

            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: markdownToSafeHtml(selectedArticle.content)
              }}
            />

            <div className="mt-8 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Was this article helpful?</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Yes
                </Button>
                <Button variant="outline" size="sm">No</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="mt-4">
          ← Back to Knowledge Hub
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Knowledge Hub</h2>
        <p className="text-muted-foreground">Search articles, guides, webinars and FAQs</p>
      </div>

      <div className="max-w-xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search articles, guides, and FAQs..."
            className="pl-12 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!searchQuery && selectedCategory === 'all' && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(helpCategories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as HelpCategory)}
              className="p-4 rounded-xl border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all text-left group"
            >
              <cat.icon className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-sm">{cat.label}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{cat.description}</p>
            </button>
          ))}
        </div>
      )}

      {(searchQuery || selectedCategory !== 'all') && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Topics
          </Button>
          {Object.entries(helpCategories).map(([key, cat]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(key as HelpCategory)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-4">
        {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
        {searchQuery && ` for "${searchQuery}"`}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map(article => (
          <motion.button
            key={article.id}
            whileHover={{ y: -2 }}
            onClick={() => { setSelectedArticle(article); tagEvent('knowledge_article_view', article.title); }}
            className="p-4 rounded-xl border bg-card hover:border-primary/30 hover:shadow-md transition-all text-left w-full group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                  {article.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {article.summary}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {article.viewCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {Math.round((article.helpfulCount / article.viewCount) * 100)}%
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </motion.button>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">No articles found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search or browse all topics.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default function SupportCenter() {
  const { currentUser } = useUser();
  useEffect(() => { tagScreen('portal-support'); }, []);
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  return (
    <AppLayout title="Support Center" subtitle="AI-powered help, knowledge base, and support tickets">
      <Tabs defaultValue="ask-carlos" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 mx-auto">
          <TabsTrigger value="ask-carlos" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Ask Carlos</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge-hub" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Knowledge Hub</span>
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            <Ticket className="h-4 w-4" />
            <span className="hidden sm:inline">Support Tickets</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="help-admin" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Help Admin</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="ask-carlos">
          <AskCarlosTab />
        </TabsContent>

        <TabsContent value="knowledge-hub">
          <KnowledgeHubTab />
        </TabsContent>

        <TabsContent value="tickets">
          <SupportTickets />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="help-admin">
            <HelpAdminContent />
          </TabsContent>
        )}
      </Tabs>
    </AppLayout>
  );
}
