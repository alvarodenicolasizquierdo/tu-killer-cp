import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface MandatoryCommentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  actionLabel: string;
  actionVariant?: 'default' | 'destructive';
  title?: string;
  description?: string;
}

/**
 * FIX 7 [C-20]: Mandatory comment modal for Query, Reject, Return, Alert actions.
 * Requires minimum 10 characters.
 */
export function MandatoryCommentModal({
  open,
  onClose,
  onSubmit,
  actionLabel,
  actionVariant = 'default',
  title = 'Comment Required',
  description = 'Please provide a reason for this action. This will be recorded in the audit trail.'
}: MandatoryCommentModalProps) {
  const [comment, setComment] = useState('');
  const isValid = comment.trim().length >= 10;

  const handleSubmit = () => {
    if (isValid) {
      onSubmit(comment.trim());
      setComment('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Textarea
            placeholder="Enter your comment (minimum 10 characters)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <p className="text-[10px] text-muted-foreground text-right">
            {comment.trim().length}/10 minimum characters
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant={actionVariant}
            disabled={!isValid}
            onClick={handleSubmit}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
