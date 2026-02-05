import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { factoryLocations } from '@/data/mockData';
import { Inspection } from '@/types';

interface FactoryMapViewProps {
  inspections: Inspection[];
  onFactoryClick?: (factoryId: string) => void;
}

const FactoryMapView = ({ inspections, onFactoryClick }: FactoryMapViewProps) => {
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

  const getStatusColor = (status: 'active' | 'at-risk' | 'critical') => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'at-risk': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
    }
  };

  const getStatusBgColor = (status: 'active' | 'at-risk' | 'critical') => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 border-emerald-200';
      case 'at-risk': return 'bg-amber-500/10 border-amber-200';
      case 'critical': return 'bg-red-500/10 border-red-200';
    }
  };

  // Map dimensions (simplified world map projection)
  const mapWidth = 900;
  const mapHeight = 450;

  // Convert lat/lng to x/y on our simplified map
  const latLngToXY = (lat: number, lng: number) => {
    // Simple Mercator-like projection centered on Asia-Pacific
    const x = ((lng + 180) / 360) * mapWidth;
    const y = ((90 - lat) / 180) * mapHeight;
    return { x, y };
  };

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
          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 overflow-x-auto">
            <svg 
              viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
              className="w-full min-w-[600px]" 
              style={{ aspectRatio: `${mapWidth}/${mapHeight}` }}
            >
              {/* Simplified continent outlines */}
              <defs>
                <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              
              {/* Asia simplified shape */}
              <path 
                d="M450 80 L550 60 L650 80 L700 150 L720 250 L680 300 L600 320 L500 300 L450 250 L420 180 Z" 
                fill="url(#landGradient)" 
                stroke="hsl(var(--border))" 
                strokeWidth="1"
              />
              
              {/* India */}
              <path 
                d="M480 200 L520 180 L550 200 L540 280 L500 320 L460 280 L470 220 Z" 
                fill="url(#landGradient)" 
                stroke="hsl(var(--border))" 
                strokeWidth="1"
              />
              
              {/* Southeast Asia */}
              <path 
                d="M560 280 L620 260 L660 300 L640 360 L580 380 L540 340 Z" 
                fill="url(#landGradient)" 
                stroke="hsl(var(--border))" 
                strokeWidth="1"
              />

              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line 
                  key={`h-${i}`} 
                  x1="0" 
                  y1={i * (mapHeight / 4)} 
                  x2={mapWidth} 
                  y2={i * (mapHeight / 4)} 
                  stroke="hsl(var(--border))" 
                  strokeWidth="0.5" 
                  strokeDasharray="4"
                  opacity="0.3"
                />
              ))}
              {[0, 1, 2, 3, 4, 5, 6].map(i => (
                <line 
                  key={`v-${i}`} 
                  x1={i * (mapWidth / 6)} 
                  y1="0" 
                  x2={i * (mapWidth / 6)} 
                  y2={mapHeight} 
                  stroke="hsl(var(--border))" 
                  strokeWidth="0.5" 
                  strokeDasharray="4"
                  opacity="0.3"
                />
              ))}

              {/* Factory markers */}
              {factoryLocations.map((factory, index) => {
                const pos = latLngToXY(factory.lat, factory.lng);
                const data = factoryInspectionData[factory.id];
                const hasCritical = data?.critical > 0;
                
                return (
                  <g key={factory.id}>
                    {/* Pulse animation for critical */}
                    {hasCritical && (
                      <motion.circle
                        cx={pos.x}
                        cy={pos.y}
                        r={20}
                        fill="none"
                        stroke="hsl(var(--destructive))"
                        strokeWidth="2"
                        initial={{ opacity: 0.8, scale: 1 }}
                        animate={{ opacity: 0, scale: 2 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    
                    {/* Main marker */}
                    <motion.g
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      style={{ cursor: 'pointer' }}
                      onClick={() => onFactoryClick?.(factory.id)}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={12}
                        className={`${getStatusColor(factory.status)} transition-colors`}
                        opacity="0.9"
                      />
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={6}
                        fill="white"
                        opacity="0.9"
                      />
                      
                      {/* Inspection count badge */}
                      {data && data.inspections.length > 0 && (
                        <>
                          <circle
                            cx={pos.x + 10}
                            cy={pos.y - 10}
                            r={8}
                            fill="hsl(var(--primary))"
                          />
                          <text
                            x={pos.x + 10}
                            y={pos.y - 6}
                            textAnchor="middle"
                            fill="white"
                            fontSize="9"
                            fontWeight="bold"
                          >
                            {data.inspections.length}
                          </text>
                        </>
                      )}
                    </motion.g>
                    
                    {/* Factory label */}
                    <text
                      x={pos.x}
                      y={pos.y + 25}
                      textAnchor="middle"
                      className="fill-foreground text-[10px] font-medium"
                    >
                      {factory.name.length > 15 ? factory.name.slice(0, 15) + '...' : factory.name}
                    </text>
                  </g>
                );
              })}
            </svg>
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
                    factory.status === 'critical' ? 'border-l-red-500' :
                    factory.status === 'at-risk' ? 'border-l-amber-500' :
                    'border-l-emerald-500'
                  }`}
                  onClick={() => onFactoryClick?.(factory.id)}
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
    </div>
  );
};

export default FactoryMapView;
