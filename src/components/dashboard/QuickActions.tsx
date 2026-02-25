import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Search, BarChart3, Users, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'secondary' | 'outline';
  description?: string;
}

const quickActions: QuickAction[] = [
  { id: 'new-trf', label: 'New TRF', icon: Plus, variant: 'default', description: 'Create a new test request' },
  { id: 'search', label: 'Search', icon: Search, variant: 'secondary', description: 'Find TRFs, suppliers, or products' },
  { id: 'reports', label: 'Reports', icon: BarChart3, variant: 'secondary', description: 'View analytics and reports' },
  { id: 'suppliers', label: 'Suppliers', icon: Users, variant: 'secondary', description: 'Manage supplier information' },
  { id: 'lab-queue', label: 'Lab Queue', icon: FlaskConical, variant: 'secondary', description: 'View testing queue' },
];

export function QuickActions() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-2">
      {quickActions.map((action) => (
        <motion.div
          key={action.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant={action.variant || 'secondary'}
            size="sm"
            className={cn(
              "gap-2",
              action.variant === 'default' && "ai-gradient border-0 hover:opacity-90"
            )}
            onMouseEnter={() => setHoveredId(action.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
