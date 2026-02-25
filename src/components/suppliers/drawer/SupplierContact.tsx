import { Mail, Phone } from 'lucide-react';

interface SupplierContactProps {
  contact: {
    name: string;
    role: string;
    email: string;
    phone?: string;
  };
}

export function SupplierContact({ contact }: SupplierContactProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-3">Primary Contact</h4>
      <div className="space-y-2">
        <p className="font-medium">{contact.name}</p>
        <p className="text-sm text-muted-foreground">{contact.role}</p>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
            {contact.email}
          </a>
        </div>
        {contact.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            {contact.phone}
          </div>
        )}
      </div>
    </div>
  );
}
