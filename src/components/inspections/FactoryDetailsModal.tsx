import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Building2, Calendar, CheckCircle2, Loader2, Clock, ExternalLink } from 'lucide-react';
import { Inspection } from '@/types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface FactoryLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  supplier: string;
  status: 'active' | 'at-risk' | 'critical';
}

interface FactoryDetailsModalProps {
  factory: FactoryLocation | null;
  inspections: Inspection[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FactoryDetailsModal = ({ factory, inspections, open, onOpenChange }: FactoryDetailsModalProps) => {
  const navigate = useNavigate();
  
  if (!factory) return null;

  const factoryInspections = inspections.filter(insp => insp.factoryId === factory.id);

  const handleInspectionClick = (inspectionId: string) => {
    onOpenChange(false);
    navigate(`/inspections/${inspectionId}`, { 
      state: { fromFactoryId: factory.id, fromFactoryName: factory.name } 
    });
  };
  
  const getStatusBadgeVariant = (status: 'active' | 'at-risk' | 'critical') => {
    switch (status) {
      case 'active': return 'default';
      case 'at-risk': return 'secondary';
      case 'critical': return 'destructive';
    }
  };

  const getStatusLabel = (status: 'active' | 'at-risk' | 'critical') => {
    switch (status) {
      case 'active': return 'Active';
      case 'at-risk': return 'At Risk';
      case 'critical': return 'Critical';
    }
  };

  const getInspectionStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'in_progress': return <Loader2 className="h-4 w-4 text-amber-600 dark:text-amber-400 animate-spin" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-primary" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return <Badge variant="destructive" className="text-xs">Critical</Badge>;
      case 'at-risk': return <Badge variant="secondary" className="text-xs">At Risk</Badge>;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {factory.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Factory Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {factory.country}
            </span>
            <span>•</span>
            <span>{factory.supplier}</span>
            <Badge variant={getStatusBadgeVariant(factory.status)}>
              {getStatusLabel(factory.status)}
            </Badge>
          </div>

          {/* Inspections List */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Inspections ({factoryInspections.length})
            </h4>
            
            {factoryInspections.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No inspections scheduled for this factory.
              </p>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {factoryInspections.map((inspection) => (
                    <Card 
                      key={inspection.id} 
                      className="border-l-4 border-l-primary cursor-pointer hover:bg-muted/50 transition-colors group"
                      onClick={() => handleInspectionClick(inspection.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getInspectionStatusIcon(inspection.status)}
                              <span className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                {inspection.title}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {inspection.type}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(inspection.scheduledDate), 'MMM d, yyyy')}
                              {inspection.assignee && (
                                <>
                                  <span>•</span>
                                  <span>{inspection.assignee}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {getPriorityBadge(inspection.priority)}
                            <Badge variant="outline" className="text-xs capitalize">
                              {inspection.status.replace('_', ' ')}
                            </Badge>
                            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FactoryDetailsModal;
