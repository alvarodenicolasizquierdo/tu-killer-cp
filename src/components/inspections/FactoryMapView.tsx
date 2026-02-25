import { useMemo, useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { factoryLocations } from '@/data/mockData';
import { Inspection } from '@/types';
import FactoryDetailsModal from './FactoryDetailsModal';

// Lazy load the map component for better performance
const WorldMap = lazy(() => import('./WorldMap'));

interface FactoryMapViewProps {
  inspections: Inspection[];
  onFactoryClick?: (factoryId: string) => void;
  initialOpenFactoryId?: string;
}

const FactoryMapView = ({ inspections, onFactoryClick, initialOpenFactoryId }: FactoryMapViewProps) => {
  const [selectedFactory, setSelectedFactory] = useState<typeof factoryLocations[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Handle initial factory selection from navigation state
  useEffect(() => {
    if (initialOpenFactoryId) {
      const factory = factoryLocations.find(f => f.id === initialOpenFactoryId);
      if (factory) {
        setSelectedFactory(factory);
        setModalOpen(true);
      }
    }
  }, [initialOpenFactoryId]);

  const handleFactoryClick = (factoryId: string) => {
    const factory = factoryLocations.find(f => f.id === factoryId);
    if (factory) {
      setSelectedFactory(factory);
      setModalOpen(true);
    }
    onFactoryClick?.(factoryId);
  };
  // Group inspections by factory
  const factoryInspectionData = useMemo(() => {
    const grouped: Record<string, { 
      scheduled: number; 
      inProgress: number; 
      completed: number; 
      critical: number;
      inspections: Inspection[];
    }> = {};
    
    inspections.forEach(insp => {
      if (!grouped[insp.factoryId]) {
        grouped[insp.factoryId] = { scheduled: 0, inProgress: 0, completed: 0, critical: 0, inspections: [] };
      }
      grouped[insp.factoryId].inspections.push(insp);
      if (insp.status === 'scheduled') grouped[insp.factoryId].scheduled++;
      if (insp.status === 'in_progress') grouped[insp.factoryId].inProgress++;
      if (insp.status === 'completed') grouped[insp.factoryId].completed++;
      if (insp.priority === 'critical' && insp.status !== 'completed') grouped[insp.factoryId].critical++;
    });
    
    return grouped;
  }, [inspections]);

  const getStatusBgColor = (status: 'active' | 'at-risk' | 'critical') => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 border-emerald-200';
      case 'at-risk': return 'bg-amber-500/10 border-amber-200';
      case 'critical': return 'bg-red-500/10 border-red-200';
    }
  };

  // Prepare markers for the map component
  const mapMarkers = useMemo(() => {
    return factoryLocations.map(factory => {
      const data = factoryInspectionData[factory.id];
      return {
        id: factory.id,
        name: factory.name,
        lat: factory.lat,
        lng: factory.lng,
        status: factory.status,
        inspectionCount: data?.inspections.length || 0,
        hasCritical: (data?.critical || 0) > 0,
      };
    });
  }, [factoryInspectionData]);

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Factory Locations Worldwide
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-950/20 dark:to-blue-900/10 h-[400px] min-h-[300px]">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
              </div>
            }>
              <WorldMap
                markers={mapMarkers}
                onMarkerClick={handleFactoryClick}
              />
            </Suspense>
          </div>
        </CardContent>
      </Card>

      {/* Factory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <TooltipProvider>
          {factoryLocations.map((factory, index) => {
            const data = factoryInspectionData[factory.id];
            
            return (
              <motion.div
                key={factory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`cursor-pointer hover:shadow-md transition-all border-l-4 ${
                    factory.status === 'critical' ? 'border-l-destructive' :
                    factory.status === 'at-risk' ? 'border-l-amber-500' :
                    'border-l-emerald-500'
                  }`}
                  onClick={() => handleFactoryClick(factory.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-sm line-clamp-1">{factory.name}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs shrink-0 ${getStatusBgColor(factory.status)}`}
                      >
                        {factory.status === 'critical' ? 'Critical' : 
                         factory.status === 'at-risk' ? 'At Risk' : 'Active'}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">{factory.supplier}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin className="h-3 w-3" />
                      {factory.country}
                    </p>
                    
                    {data && (
                      <div className="flex items-center gap-3 pt-2 border-t">
                        {data.scheduled > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-xs text-blue-600">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                {data.scheduled}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Scheduled</TooltipContent>
                          </Tooltip>
                        )}
                        {data.inProgress > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-xs text-amber-600">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                {data.inProgress}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>In Progress</TooltipContent>
                          </Tooltip>
                        )}
                        {data.completed > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-xs text-emerald-600">
                                <CheckCircle2 className="h-3 w-3" />
                                {data.completed}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Completed</TooltipContent>
                          </Tooltip>
                        )}
                        {data.critical > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-xs text-red-600">
                                <AlertTriangle className="h-3 w-3" />
                                {data.critical}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Critical</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </TooltipProvider>
      </div>

      <FactoryDetailsModal
        factory={selectedFactory}
        inspections={inspections}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default FactoryMapView;
