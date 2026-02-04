import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { MapPin, Clock, User, Building2, CheckCircle2, AlertTriangle, Loader2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Inspection, InspectionType, InspectionStatus } from '@/types';

interface InspectionCardProps {
  inspection: Inspection;
  compact?: boolean;
}

const InspectionCard = ({ inspection, compact = false }: InspectionCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/inspections/${inspection.id}`);
  };
  const getTypeColor = (type: InspectionType) => {
    switch (type) {
      case 'factory_audit': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'quality_check': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'social_compliance': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'environmental': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'pre_shipment': return 'bg-amber-500/10 text-amber-600 border-amber-200';
    }
  };

  const getTypeLabel = (type: InspectionType) => {
    switch (type) {
      case 'factory_audit': return 'Factory Audit';
      case 'quality_check': return 'Quality Check';
      case 'social_compliance': return 'Social Compliance';
      case 'environmental': return 'Environmental';
      case 'pre_shipment': return 'Pre-Shipment';
    }
  };

  const getStatusBadge = (status: InspectionStatus) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Scheduled</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" />In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">Cancelled</Badge>;
      case 'postponed':
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Postponed</Badge>;
    }
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-4 border-l-red-500';
      case 'at-risk': return 'border-l-4 border-l-amber-500';
      case 'on-track': return 'border-l-4 border-l-emerald-500';
      default: return 'border-l-4 border-l-blue-500';
    }
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ x: 2 }}
        onClick={handleClick}
        className={`p-3 rounded-lg border bg-card hover:shadow-md transition-all cursor-pointer ${getPriorityBorder(inspection.priority)}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className={`text-xs ${getTypeColor(inspection.type)}`}>
            {getTypeLabel(inspection.type)}
          </Badge>
          {getStatusBadge(inspection.status)}
        </div>
        <p className="font-medium text-sm line-clamp-1">{inspection.title}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{inspection.scheduledTime || '09:00'}</span>
          <span className="text-border">•</span>
          <span>{inspection.duration}h</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={handleClick}
    >
      <Card className={`h-full hover:shadow-lg transition-all cursor-pointer ${getPriorityBorder(inspection.priority)}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="outline" className={`${getTypeColor(inspection.type)}`}>
              {getTypeLabel(inspection.type)}
            </Badge>
            {getStatusBadge(inspection.status)}
          </div>
          <CardTitle className="text-base font-semibold line-clamp-2 mt-2">
            {inspection.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{inspection.factoryName}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{inspection.location}</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(parseISO(inspection.scheduledDate), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{inspection.scheduledTime || '09:00'}</span>
            </div>
          </div>

          {inspection.assignee && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{inspection.assignee}</span>
            </div>
          )}

          {inspection.status === 'completed' && inspection.passRate !== undefined && (
            <div className="pt-2 border-t space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pass Rate</span>
                <span className="font-medium">{inspection.passRate}%</span>
              </div>
              <Progress value={inspection.passRate} className="h-1.5" />
              {inspection.findings !== undefined && inspection.findings > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{inspection.findings} finding{inspection.findings > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InspectionCard;
