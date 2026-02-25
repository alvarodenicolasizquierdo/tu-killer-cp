import { TRFDocument } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
  FileText, 
  Image, 
  FileCheck, 
  File, 
  Download, 
  Eye,
  Upload
} from 'lucide-react';
import { motion } from 'framer-motion';

const typeIconMap: Record<TRFDocument['type'], React.ComponentType<{ className?: string }>> = {
  coa: FileCheck,
  test_report: FileText,
  sample_photo: Image,
  specification: File,
  other: File,
};

const typeColorMap: Record<TRFDocument['type'], string> = {
  coa: 'bg-emerald-500/10 text-emerald-600',
  test_report: 'bg-blue-500/10 text-blue-600',
  sample_photo: 'bg-purple-500/10 text-purple-600',
  specification: 'bg-amber-500/10 text-amber-600',
  other: 'bg-slate-500/10 text-slate-600',
};

const typeLabelMap: Record<TRFDocument['type'], string> = {
  coa: 'Certificate of Analysis',
  test_report: 'Test Report',
  sample_photo: 'Sample Photo',
  specification: 'Specification',
  other: 'Other',
};

interface TRFDocumentsProps {
  documents: TRFDocument[];
}

export function TRFDocuments({ documents }: TRFDocumentsProps) {
  return (
    <div className="space-y-3">
      {/* Upload button */}
      <Button variant="outline" className="w-full border-dashed">
        <Upload className="w-4 h-4 mr-2" />
        Upload Document
      </Button>

      {/* Document list */}
      <div className="space-y-2">
        {documents.map((doc, index) => {
          const Icon = typeIconMap[doc.type];
          const colorClass = typeColorMap[doc.type];

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center gap-3 p-3 rounded-lg border hover:border-primary/30 hover:bg-muted/30 transition-all"
            >
              {/* Icon */}
              <div className={cn("p-2 rounded-lg", colorClass)}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{doc.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{typeLabelMap[doc.type]}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{format(new Date(doc.uploadedAt), 'MMM d, yyyy')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
