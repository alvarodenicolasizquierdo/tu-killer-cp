import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  FileText,
  Video,
  Mail,
  BookOpen,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { contextualQuestions, mockArticles } from '@/data/helpData';
import { useUser } from '@/contexts/UserContext';

interface AIAnswerPanelProps {
  question: string;
  screenContext: {
    title: string;
    description: string;
  };
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  confidence?: number;
  sources?: {
    type: 'email' | 'webinar' | 'guide' | 'sop' | 'ai';
    reference: string;
    date?: string;
  }[];
  relatedArticles?: typeof mockArticles;
  needsConfirmation?: boolean;
}

const getSourceIcon = (type: string) => {
  switch (type) {
    case 'email': return Mail;
    case 'webinar': return Video;
    case 'guide': return BookOpen;
    case 'sop': return FileText;
    default: return Sparkles;
  }
};

export function AIAnswerPanel({ question, screenContext, onBack }: AIAnswerPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useUser();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-ask initial question if provided
  useEffect(() => {
    if (question) {
      handleSend(question);
    }
  }, []);

  const findAnswer = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Find matching contextual question
    const matchingQuestion = contextualQuestions.find(q =>
      q.question.toLowerCase().includes(lowerQuery) ||
      lowerQuery.includes(q.question.toLowerCase().slice(0, 20))
    );

    if (matchingQuestion) {
      return {
        answer: matchingQuestion.answer,
        confidence: matchingQuestion.confidence,
        sources: matchingQuestion.source ? [matchingQuestion.source] : undefined,
        needsConfirmation: matchingQuestion.confidence < 80,
      };
    }

    // Find matching articles
    const matchingArticles = mockArticles.filter(article =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.tags.some(tag => lowerQuery.includes(tag))
    );

    if (matchingArticles.length > 0) {
      return {
        answer: matchingArticles[0].summary + '\n\nWould you like me to explain in more detail?',
        confidence: 85,
        sources: matchingArticles[0].source ? [matchingArticles[0].source] : undefined,
        relatedArticles: matchingArticles.slice(0, 2),
      };
    }

    // Default response
    return {
      answer: `I understand you're asking about "${query}" in the context of ${screenContext.title}. While I don't have a specific answer in my knowledge base, I can help you:\n\n• Search the Knowledge Hub for related articles\n• Connect you with the SMART support team\n• Create a support ticket for specialized help\n\nWould you like me to try any of these options?`,
      confidence: 45,
      needsConfirmation: true,
      sources: [{ type: 'ai' as const, reference: 'AI-generated response' }],
    };
  };

  const handleSend = (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = findAnswer(message);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        confidence: response.confidence,
        sources: response.sources,
        relatedArticles: response.relatedArticles,
        needsConfirmation: response.needsConfirmation,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-emerald-600 bg-emerald-500/10 border-emerald-200';
    if (confidence >= 70) return 'text-primary bg-primary/10 border-primary/20';
    return 'text-amber-600 bg-amber-500/10 border-amber-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-sm font-medium">Ask AI</h3>
          <p className="text-xs text-muted-foreground">
            Context: {screenContext.title}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && !isTyping && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-xl ai-gradient flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-medium mb-1">AI Support Assistant</h4>
              <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                Ask me anything about {screenContext.title}. I'll provide answers with sources and confidence levels.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                message.role === 'user' && "flex-row-reverse"
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                message.role === 'assistant' ? "ai-gradient" : "bg-primary"
              )}>
                {message.role === 'assistant' ? (
                  <Bot className="h-4 w-4 text-white" />
                ) : (
                  <User className="h-4 w-4 text-primary-foreground" />
                )}
              </div>

              {/* Message Content */}
              <div className={cn(
                "max-w-[85%] space-y-2",
                message.role === 'user' && "items-end"
              )}>
                <div className={cn(
                  message.role === 'assistant' ? "ai-bubble" : "user-bubble"
                )}>
                  <p className={cn(
                    "text-sm whitespace-pre-line",
                    message.role === 'user' && "text-primary-foreground"
                  )}>
                    {message.content}
                  </p>
                </div>

                {/* Confidence & Sources for AI messages */}
                {message.role === 'assistant' && message.confidence && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-[10px]", getConfidenceColor(message.confidence))}
                    >
                      {message.confidence >= 90 && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {message.confidence < 70 && <AlertCircle className="h-3 w-3 mr-1" />}
                      {message.confidence}% confident
                    </Badge>
                    
                    {message.needsConfirmation && (
                      <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-200">
                        SME review requested
                      </Badge>
                    )}
                  </div>
                )}

                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="space-y-1">
                    {message.sources.map((source, i) => {
                      const SourceIcon = getSourceIcon(source.type);
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-[11px] text-muted-foreground"
                        >
                          <SourceIcon className="h-3 w-3" />
                          <span>Source: {source.reference}</span>
                          {source.date && <span>({source.date})</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Related Articles */}
                {message.relatedArticles && message.relatedArticles.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <span className="text-[11px] text-muted-foreground">Related articles:</span>
                    {message.relatedArticles.map(article => (
                      <a
                        key={article.id}
                        href="/knowledge-hub"
                        className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors text-xs"
                      >
                        <BookOpen className="h-3 w-3 text-primary" />
                        {article.title}
                        <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Feedback */}
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-muted-foreground">Helpful?</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg ai-gradient flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="ai-bubble">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-ai-primary" />
                  <span className="text-sm text-muted-foreground">Searching knowledge base...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <Input
            placeholder="Ask a follow-up question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            className="ai-gradient border-0 shrink-0"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          Answers are based on historical emails, webinars, and SOPs
        </p>
      </div>
    </motion.div>
  );
}
