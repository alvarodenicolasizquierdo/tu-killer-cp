import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Specialization {
  id: string;
  name: string;
}

interface SupplierSpecializationsProps {
  specializations: Specialization[];
}

export function SupplierSpecializations({ specializations }: SupplierSpecializationsProps) {
  if (specializations.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Tag className="w-4 h-4" />
        Specializations ({specializations.length})
      </h4>
      <div className="flex flex-wrap gap-2">
        {specializations.map((spec) => (
          <Badge key={spec.id} variant="secondary">{spec.name}</Badge>
        ))}
      </div>
    </div>
  );
}
