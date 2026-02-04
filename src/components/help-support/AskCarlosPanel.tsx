import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GuidedResolutionData } from './GuidedResolution';
import { helpKnowledgeBase, matchArticleByQuery, HelpArticle } from '@/data/helpKnowledgeBase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  matchedResolution?: GuidedResolutionData;
}

interface AskCarlosPanelProps {
  onResolutionMatch?: (resolution: GuidedResolutionData) => void;
}

// Quick suggestions for common issues
const quickSuggestions = [
  { label: 'Create Audit', query: "I can't create an audit" },
  { label: 'Testing issue', query: "Send to Lab button is disabled" },
  { label: 'Care label wrong', query: "My care label content is wrong" },
  { label: 'Fitlog photos', query: "Fitlog photos aren't showing up" },
  { label: 'Care code issue', query: "Care code changes aren't applying" },
  { label: 'Missing tab', query: "Supplier can't see Product Development tabs" },
];

// Intent matching keywords - includes tags for semantic matching
const intentMatchers: { id: string; keywords: string[]; resolution: string }[] = [
  { id: 'create-audit', keywords: ['create audit', 'new audit', 'schedule audit', 'factory audit', 'can\'t create audit', 'cannot create audit'], resolution: 'create-audit' },
  { id: 'create-workbook', keywords: ['workbook', 'create workbook', 'new workbook', 'can\'t create workbook', 'cannot create workbook'], resolution: 'create-workbook' },
  { id: 'submit-trf', keywords: ['trf', 'top sheet', 'submit trf', 'can\'t submit', 'cannot submit', 'submit to lab', 'topsheet'], resolution: 'submit-trf' },
  { id: 'send-to-lab', keywords: ['send to lab', 'lab disabled', 'send lab button', 'lab button grey', 'lab button disabled'], resolution: 'send-to-lab' },
  { id: 'fabric-no-test-link', keywords: ['fabric linked', 'test link', 'no test', 'fabric test', 'linked but'], resolution: 'fabric-no-test-link' },
  { id: 'excel-missing-fields', keywords: ['excel', 'export missing', 'missing fields', 'missing columns', 'excel export'], resolution: 'excel-missing-fields' },
  { id: 'upload-photos-phone', keywords: ['upload photos', 'photos phone', 'can\'t upload', 'cannot upload', 'mobile upload', 'phone photos'], resolution: 'upload-photos-phone' },
  { id: 'supplier-no-pd-tabs', keywords: ['supplier', 'product development', 'pd tabs', 'can\'t see tabs', 'supplier tabs', 'missing tabs'], resolution: 'supplier-no-pd-tabs' },
  // Care label resolutions
  { id: 'care-label-wrong', keywords: ['care label wrong', 'care label incorrect', 'wrong symbols', 'wash symbols', 'care instructions wrong', 'label content'], resolution: 'care-label-wrong' },
  { id: 'care-label-missing', keywords: ['generate care label', 'can\'t generate label', 'cannot generate label', 'care label disabled', 'no care label'], resolution: 'care-label-missing' },
  // Fitlog resolutions
  { id: 'fitlog-photos-missing', keywords: ['fitlog photos', 'fit photos missing', 'photos not showing', 'fitlog images', 'fit session photos'], resolution: 'fitlog-photos-missing' },
  { id: 'fitlog-cant-create', keywords: ['create fitlog', 'new fitlog', 'can\'t create fit', 'cannot create fit', 'fit session disabled', 'add fit session'], resolution: 'fitlog-cant-create' },
  { id: 'fitlog-measurements-wrong', keywords: ['fitlog measurements', 'measurements wrong', 'measurements don\'t match', 'spec mismatch', 'tolerance'], resolution: 'fitlog-measurements-wrong' },
  // Care code resolutions
  { id: 'carecode-not-applying', keywords: ['care code', 'carecode', 'code not applying', 'care code changes', 'label not updating', 'care code update'], resolution: 'carecode-not-applying' },
];

// Convert HelpArticle to GuidedResolutionData
function articleToResolution(article: HelpArticle): GuidedResolutionData {
  return {
    id: article.id,
    title: article.title,
    intent: `You want to: ${article.intent}`,
    causes: article.why_usually_happens,
    steps: article.fix_steps.map((step, i) => ({
      action: `Step ${i + 1}`,
      detail: step
    })),
    tags: article.tags,
    aiNotes: {
      rootCauseTags: article.ai_hidden_notes.root_cause_tags,
      confidence: article.ai_hidden_notes.triage_priority === 'high' ? 0.95 : 
                  article.ai_hidden_notes.triage_priority === 'medium' ? 0.85 : 0.75,
      relatedIssues: []
    }
  };
}

function matchIntent(message: string): GuidedResolutionData | null {
  const matchedArticle = matchArticleByQuery(message);
  if (matchedArticle) {
    return articleToResolution(matchedArticle);
  }
  return null;
}

function generateConversationalResponse(resolution: GuidedResolutionData): string {
  const causesSummary = resolution.causes.slice(0, 2).join(' or ');
  
  return `I see what's happening. **${resolution.title}**

This usually happens when ${causesSummary.toLowerCase()}.

Here's the quick fix — I've loaded the step-by-step guide for you. Just follow the numbered steps and you should be sorted in about 60 seconds.

If that doesn't work, you can always escalate to the SGS support team.`;
}

export function AskCarlosPanel({ onResolutionMatch }: AskCarlosPanelProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;
    
    // Add user message
    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate typing
    setIsTyping(true);
    
    setTimeout(() => {
      // Try to match intent
      const matchedResolution = matchIntent(text);
      
      let assistantMessage: Message;
      
      if (matchedResolution) {
        assistantMessage = {
          role: 'assistant',
          content: generateConversationalResponse(matchedResolution),
          matchedResolution
        };
        onResolutionMatch?.(matchedResolution);
      } else {
        assistantMessage = {
          role: 'assistant',
          content: `I'm looking into that for you. Could you tell me a bit more about what you're trying to do?\n\nFor example:\n• Are you creating something new?\n• Is a button disabled or missing?\n• Are you seeing an error message?\n\nThe more details you share, the faster I can help!`
        };
      }
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickSuggestion = (suggestion: typeof quickSuggestions[number]) => {
    handleSend(suggestion.query);
  };

  return (
    <div className="bg-gradient-to-b from-card to-card/95 rounded-xl border border-border shadow-sm h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold">
                <Bot className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              Ask Carlos
              <Sparkles className="w-4 h-4 text-primary" />
            </h3>
            <p className="text-xs text-muted-foreground">Connected to Help knowledge</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-medium text-foreground mb-1">What's the problem?</h4>
              <p className="text-sm text-muted-foreground mb-4 max-w-[240px] mx-auto">
                Describe what you're stuck on and I'll find the fix.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? "flex-row-reverse" : ""
                  )}
                >
                  <Avatar className="w-7 h-7 shrink-0">
                    <AvatarFallback className={cn(
                      "text-xs",
                      message.role === 'user' 
                        ? "bg-muted text-muted-foreground" 
                        : "bg-gradient-to-br from-primary to-primary/80 text-white"
                    )}>
                      {message.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2.5",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content.split('**').map((part, i) => 
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </p>
                    
                    {/* Show resolution link if matched */}
                    {message.matchedResolution && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-border/50"
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full justify-between text-xs h-8"
                          onClick={() => onResolutionMatch?.(message.matchedResolution!)}
                        >
                          <span>View step-by-step guide</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-xl px-3 py-2.5">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>

      {/* Quick Suggestions */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-1.5">
          {quickSuggestions.map((suggestion) => (
            <Button
              key={suggestion.label}
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2.5 bg-muted/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
              onClick={() => handleQuickSuggestion(suggestion)}
            >
              {suggestion.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-card/50">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your problem..."
            className="min-h-[40px] max-h-24 resize-none text-sm"
            rows={1}
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={!input.trim()}
            className="shrink-0 w-10 h-10"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
