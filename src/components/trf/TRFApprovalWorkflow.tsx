import { TRF, TRFStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  MessageSquare,
  Sparkles,
  RotateCcw,
  Send,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { DisabledButtonHelp } from '@/components/help/InlineHelpTooltip';
import { useBuyerReadOnly } from '@/hooks/useBuyerReadOnly';
import { AIConfidenceMetadata } from '@/components/compliance/AIConfidenceMetadata';
import { AIDisclaimerLine } from '@/components/compliance/AIDisclaimerLine';
import { MandatoryCommentModal } from '@/components/compliance/MandatoryCommentModal';

interface TRFApprovalWorkflowProps {
  trf: TRF;
}

export function TRFApprovalWorkflow({ trf }: TRFApprovalWorkflowProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const { isBuyerReadOnly } = useBuyerReadOnly();

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('TRF Approved', {
        description: `${trf.reference} has been approved successfully.`
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleReject = (rejectionComment: string) => {
    setIsSubmitting(true);
    setRejectModalOpen(false);
    setTimeout(() => {
      toast.error('TRF Rejected', {
        description: `${trf.reference} has been rejected. Reason: ${rejectionComment.slice(0, 50)}...`
      });
      setIsSubmitting(false);
      setComment('');
    }, 1000);
  };

  const handleRequestRetest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      toast.info('Retest Requested', {
        description: `Retest request sent for ${trf.reference}.`
      });
      setIsSubmitting(false);
    }, 1000);
  };

  // FIX 2 [C-02]: Reframed as prioritisation, not approval recommendation
  const aiRecommendation = {
    action: 'review' as const,
    confidence: 87,
    reasoning: 'High priority for review — 3 pending TRFs approaching SLA deadline. Suggested review order based on submission date and test complexity.',
    risks: [
      'Minor pH deviation may require documentation for EU export',
      'Recommend verifying wash care instructions for pH-sensitive colors'
    ],
    dataSource: 'Based on 45 historical TRFs from this supplier',
  };

  const isActionable = !isBuyerReadOnly && (trf.status === 'pending_review' || trf.status === 'in_progress');

  return (
    <div className="space-y-4">
      {/* Mandatory Comment Modal for Reject [FIX 7: C-20] */}
      <MandatoryCommentModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onSubmit={handleReject}
        actionLabel="Confirm Rejection"
        actionVariant="destructive"
        title="Reject TRF — Comment Required"
        description="You must provide a reason for rejection. This will be recorded in the audit trail for DA-09 compliance."
      />
      {/* AI Recommendation */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-sm">AI Review Prioritisation</h4>
                <AIConfidenceMetadata confidence={aiRecommendation.confidence} dataSource={aiRecommendation.dataSource} sampleSize={45} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {aiRecommendation.reasoning}
              </p>
              <AIDisclaimerLine />
              
              {aiRecommendation.risks.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Considerations:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
                    {aiRecommendation.risks.map((risk, i) => (
                      <li key={i} className="list-disc">{risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Feedback buttons */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground">Was this helpful?</span>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <ThumbsDown className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
        <span className="text-sm text-muted-foreground">Current Status</span>
        <Badge variant="outline" className={cn(
          trf.status === 'pending_review' && "bg-amber-100 text-amber-700 border-amber-200",
          trf.status === 'approved' && "bg-emerald-100 text-emerald-700 border-emerald-200",
          trf.status === 'rejected' && "bg-red-100 text-red-700 border-red-200",
          trf.status === 'in_progress' && "bg-blue-100 text-blue-700 border-blue-200"
        )}>
          {trf.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      {/* Comment box */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Add Comment
        </label>
        <Textarea
          placeholder="Add notes or reasons for your decision..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[80px] resize-none"
        />
      </div>

      <Separator />

      {/* Action buttons */}
      {isActionable && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <div className="flex gap-2">
            {isSubmitting ? (
              <DisabledButtonHelp
                reason="Your action is being processed. Please wait for it to complete."
              >
                <Button className="flex-1 bg-emerald-600" disabled>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve TRF
                </Button>
              </DisabledButtonHelp>
            ) : (
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleApprove}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve TRF
              </Button>
            )}
            {isSubmitting ? (
              <DisabledButtonHelp
                reason="Your action is being processed. Please wait for it to complete."
              >
                <Button variant="destructive" className="flex-1" disabled>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </DisabledButtonHelp>
            ) : (
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => setRejectModalOpen(true)}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            )}
          </div>
          
          {isSubmitting ? (
            <DisabledButtonHelp
              reason="Your action is being processed. Please wait for it to complete."
            >
              <Button variant="outline" className="w-full" disabled>
                <RotateCcw className="w-4 h-4 mr-2" />
                Request Retest
              </Button>
            </DisabledButtonHelp>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleRequestRetest}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Request Retest
            </Button>
          )}

          {comment && (
            isSubmitting ? (
              <DisabledButtonHelp
                reason="Your action is being processed. Please wait for it to complete."
              >
                <Button variant="secondary" className="w-full" disabled>
                  <Send className="w-4 h-4 mr-2" />
                  Add Comment Only
                </Button>
              </DisabledButtonHelp>
            ) : (
              <Button variant="secondary" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Add Comment Only
              </Button>
            )
          )}
        </motion.div>
      )}

      {!isActionable && (
        <div className="p-4 rounded-lg bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">
            This TRF is not currently awaiting approval action.
          </p>
        </div>
      )}
    </div>
  );
}
