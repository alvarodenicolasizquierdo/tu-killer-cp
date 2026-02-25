import { Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: 'valid' | 'expiring_soon' | 'expired';
}

interface SupplierCertificationsProps {
  certifications: Certification[];
}

const statusConfig = {
  valid: { label: 'Valid', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  expiring_soon: { label: 'Expiring Soon', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  expired: { label: 'Expired', className: 'bg-red-100 text-red-700 border-red-200' },
};

export function SupplierCertifications({ certifications }: SupplierCertificationsProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Award className="w-4 h-4" />
        Certifications ({certifications.length})
      </h4>
      <div className="space-y-2">
        {certifications.map((cert) => {
          const config = statusConfig[cert.status];
          return (
            <div key={cert.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">{cert.name}</p>
                <p className="text-xs text-muted-foreground">{cert.issuer}</p>
              </div>
              <Badge variant="outline" className={cn('text-xs', config.className)}>
                {config.label}
              </Badge>
            </div>
          );
        })}
        {certifications.length === 0 && (
          <p className="text-sm text-muted-foreground">No certifications on file</p>
        )}
      </div>
    </div>
  );
}
