import { useState, useRef, useEffect } from 'react';
import { chatMessageToSafeHtml } from '@/lib/sanitize';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  Send, 
  Mic, 
  Paperclip, 
  ThumbsUp, 
  ThumbsDown,
  ChevronRight,
  Bot,
  User,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/types';
import { aiDemoResponses } from '@/data/mockData';

const suggestedQueries = [
  "Show me overdue TRFs",
  "What tests failed this week?",
  "Which suppliers are at risk?",
  "Summarize my pending approvals"
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm CARLOS, your AI-powered TIC assistant. I can help you with:\n\n• **TRF queries** - "Show me overdue TRFs for River Island"\n• **Test analysis** - "What failed tests did we have last week?"\n• **Supplier insights** - "Which suppliers have expiring certificates?"\n• **Quick actions** - "Summarize my pending approvals"\n\nHow can I help you today?`,
      timestamp: new Date().toISOString(),
      suggestions: suggestedQueries
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerMessage = message.toLowerCase();
      let responseData = aiDemoResponses.default;

      if (lowerMessage.includes('overdue') || lowerMessage.includes('pending')) {
        responseData = aiDemoResponses.overdue;
      } else if (lowerMessage.includes('fail') || lowerMessage.includes('test')) {
        responseData = aiDemoResponses.failed;
      } else if (lowerMessage.includes('supplier') || lowerMessage.includes('risk')) {
        responseData = aiDemoResponses.supplier;
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
    }, 1500);
  };

  return (
    <AppLayout title="AI Assistant" subtitle="Ask CARLOS anything about your TIC operations">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[calc(100vh-200px)] flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b bg-gradient-to-r from-ai-primary/5 to-ai-secondary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl ai-gradient flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">CARLOS AI</h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Online • Ready to help
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index === messages.length - 1 ? 0 : 0 }}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' && "flex-row-reverse"
                    )}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      message.role === 'assistant' 
                        ? "ai-gradient" 
                        : "bg-primary"
                    )}>
                      {message.role === 'assistant' ? (
                        <Bot className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={cn(
                      "max-w-[80%] space-y-2",
                      message.role === 'user' && "items-end"
                    )}>
                      <div className={cn(
                        message.role === 'assistant' ? "ai-bubble" : "user-bubble"
                      )}>
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

                      {/* Suggestions */}
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

                      {/* Feedback for AI messages */}
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

              {/* Typing Indicator */}
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
                      <span className="text-sm text-muted-foreground">CARLOS is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-background">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="flex items-center gap-2"
            >
              <Button type="button" variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                ref={inputRef}
                placeholder="Ask CARLOS anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon" className="shrink-0">
                <Mic className="w-5 h-5" />
              </Button>
              <Button 
                type="submit" 
                className="ai-gradient border-0 shrink-0"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-2">
              CARLOS can search TRFs, analyze test results, and provide recommendations.
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
