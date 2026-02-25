import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  User, 
  Building2, 
  Factory, 
  CheckCircle2, 
  AlertCircle,
  Bot,
  Sparkles
} from 'lucide-react';
import { GuidedResolutionData } from './GuidedResolution';
import { toast } from 'sonner';

interface EscalationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resolution: GuidedResolutionData | null;
  completedSteps: number[];
}

// Mock user context - in production this would come from auth/context
const mockUserContext = {
  name: 'Sarah Chen',
  role: 'QA Manager',
  supplier: 'Textile Solutions Ltd',
  factory: 'Dhaka Unit 3',
  style: 'SS25-1042',
};

export function EscalationPanel({ 
  open, 
  onOpenChange, 
  resolution,
  completedSteps 
}: EscalationPanelProps) {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) {
      toast.error('Please describe what is happening');
      return;
    }

    setIsSubmitting(true);

    // Simulate ticket submission
    setTimeout(() => {
      const ticket = {
        user: mockUserContext,
        issue: {
          intent: resolution?.id,
          title: resolution?.title,
          description: description,
        },
        context: {
          stepsAttempted: resolution?.steps
            .map((step, i) => ({
              step: step.action,
              completed: completedSteps.includes(i),
            })),
          rootCauseTags: resolution?.aiNotes?.rootCauseTags,
        },
        timestamp: new Date().toISOString(),
      };

      console.log('Escalation ticket:', ticket);

      toast.success('Ticket submitted to THT Support', {
        description: 'Reference: ESC-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      });

      setDescription('');
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1500);
  };

  const attemptedCount = completedSteps.length;
  const totalSteps = resolution?.steps.length || 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:w-[480px] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b border-border bg-destructive/5">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Escalate to THT Support
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            We'll route this to the right specialist
          </p>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Auto-filled Context */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Auto-filled from your session
              </h3>
              
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Your Name</Label>
                    <p className="text-sm font-medium">{mockUserContext.name}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {mockUserContext.role}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Supplier</Label>
                    <p className="text-sm font-medium">{mockUserContext.supplier}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Factory className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Factory</Label>
                      <p className="text-sm font-medium">{mockUserContext.factory}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Style</Label>
                      <p className="text-sm font-medium">{mockUserContext.style}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* User Input */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-semibold">
                What is happening?
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in your own words..."
                className="min-h-[100px] resize-none"
              />
            </div>

            <Separator />

            {/* Carlos Attachments */}
            {resolution && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  Carlos will attach
                </h3>

                <div className="space-y-3">
                  {/* Matched Intent */}
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <Label className="text-xs text-muted-foreground">Matched Issue</Label>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {resolution.title}
                    </p>
                  </div>

                  {/* Steps Attempted */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">Steps Attempted</Label>
                      <Badge variant={attemptedCount === totalSteps ? 'default' : 'secondary'} className="text-xs">
                        {attemptedCount}/{totalSteps} completed
                      </Badge>
                    </div>
                    <div className="space-y-1.5 mt-2">
                      {resolution.steps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs"
                        >
                          {completedSteps.includes(index) ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30 shrink-0" />
                          )}
                          <span className={completedSteps.includes(index) ? 'text-foreground' : 'text-muted-foreground'}>
                            {step.action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Root Cause Tags */}
                  {resolution.aiNotes?.rootCauseTags && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <Label className="text-xs text-muted-foreground">Diagnostic Tags</Label>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {resolution.aiNotes.rootCauseTags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Submit Button */}
        <div className="p-4 border-t border-border bg-card">
          <Button
            onClick={handleSubmit}
            disabled={!description.trim() || isSubmitting}
            className="w-full"
            variant="destructive"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Escalation
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Average response time: 2-4 hours
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
