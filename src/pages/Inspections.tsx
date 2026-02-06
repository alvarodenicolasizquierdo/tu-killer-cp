import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Plus, List, Grid3X3, MapPin, Clock, User, Building2, Filter, CheckCircle2, AlertTriangle, Loader2, GripVertical, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { mockInspections as initialInspections, mockSuppliers } from '@/data/mockData';
import { Inspection, InspectionType, InspectionStatus } from '@/types';
import InspectionForm from '@/components/inspections/InspectionForm';
import InspectionCard from '@/components/inspections/InspectionCard';
import CalendarDayCell from '@/components/inspections/CalendarDayCell';
import FactoryMapView from '@/components/inspections/FactoryMapView';
import { useInspectionDragDrop } from '@/hooks/useInspectionDragDrop';
import { useFeatureFlag } from '@/config/featureFlags';
interface LocationState {
  openFactoryId?: string;
}

const Inspections = () => {
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Feb 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'map'>(() => 
    locationState?.openFactoryId ? 'map' : 'calendar'
  );
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [inspections, setInspections] = useState<Inspection[]>(initialInspections);
  const [initialFactoryId, setInitialFactoryId] = useState<string | undefined>(locationState?.openFactoryId);
  const [showAllInspections, setShowAllInspections] = useState(false);
  const newNavEnabled = useFeatureFlag('NEW_IA_NAV_AND_HOME');

  // Clear the initial factory ID after it's been used
  useEffect(() => {
    if (locationState?.openFactoryId) {
      // Clear state after modal opens to prevent reopening on re-render
      const timer = setTimeout(() => setInitialFactoryId(undefined), 100);
      return () => clearTimeout(timer);
    }
  }, [locationState?.openFactoryId]);

  const {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    isDragOver,
    setIsDragOver,
  } = useInspectionDragDrop();

  const inspectionTypes: { value: InspectionType; label: string }[] = [
    { value: 'factory_audit', label: 'Factory Audit' },
    { value: 'quality_check', label: 'Quality Check' },
    { value: 'social_compliance', label: 'Social Compliance' },
    { value: 'environmental', label: 'Environmental' },
    { value: 'pre_shipment', label: 'Pre-Shipment' },
  ];

  const filteredInspections = useMemo(() => {
    return inspections.filter(insp => {
      const matchesType = typeFilter === 'all' || insp.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || insp.status === statusFilter;
      return matchesType && matchesStatus;
    });
  }, [inspections, typeFilter, statusFilter]);

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getInspectionsForDate = useCallback((date: Date) => {
    return filteredInspections.filter(insp => 
      isSameDay(parseISO(insp.scheduledDate), date)
    );
  }, [filteredInspections]);

  const selectedDateInspections = selectedDate 
    ? getInspectionsForDate(selectedDate)
    : [];

  const getTypeColor = (type: InspectionType) => {
    switch (type) {
      case 'factory_audit': return 'bg-blue-500';
      case 'quality_check': return 'bg-emerald-500';
      case 'social_compliance': return 'bg-purple-500';
      case 'environmental': return 'bg-green-500';
      case 'pre_shipment': return 'bg-amber-500';
    }
  };

  const getTypeLabel = (type: InspectionType) => {
    return inspectionTypes.find(t => t.value === type)?.label || type;
  };

  const getStatusBadge = (status: InspectionStatus) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Scheduled</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200"><Loader2 className="h-3 w-3 mr-1 animate-spin" />In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">Cancelled</Badge>;
      case 'postponed':
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Postponed</Badge>;
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500';
      case 'at-risk': return 'border-l-amber-500';
      case 'on-track': return 'border-l-emerald-500';
      default: return 'border-l-blue-500';
    }
  };

  // Handle inspection reschedule
  const handleReschedule = useCallback((inspectionId: string, newDate: string) => {
    setInspections(prev => prev.map(insp => {
      if (insp.id === inspectionId) {
        const updatedInsp = { ...insp, scheduledDate: newDate };
        toast.success(
          `Rescheduled "${insp.title}"`,
          { description: `Moved to ${format(parseISO(newDate), 'EEEE, MMMM d, yyyy')}` }
        );
        return updatedInsp;
      }
      return insp;
    }));
  }, []);

  const handleDragOverCell = useCallback((e: React.DragEvent, day: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(format(day, 'yyyy-MM-dd'));
  }, [setIsDragOver]);

  const handleDragLeaveCell = useCallback(() => {
    setIsDragOver(null);
  }, [setIsDragOver]);

  const handleDropOnCell = useCallback((e: React.DragEvent, day: Date) => {
    e.preventDefault();
    handleDrop(day, handleReschedule);
  }, [handleDrop, handleReschedule]);

  // Stats based on all inspections
  const stats = useMemo(() => {
    const upcoming = inspections.filter(i => i.status === 'scheduled').length;
    const inProgress = inspections.filter(i => i.status === 'in_progress').length;
    const completed = inspections.filter(i => i.status === 'completed').length;
    const cancelled = inspections.filter(i => i.status === 'cancelled').length;
    const postponed = inspections.filter(i => i.status === 'postponed').length;
    const critical = inspections.filter(i => i.priority === 'critical' && i.status !== 'completed').length;
    return { upcoming, inProgress, completed, cancelled, postponed, critical };
  }, [inspections]);

  // Filtered counts for tabs
  const tabCounts = useMemo(() => ({
    upcoming: filteredInspections.filter(i => i.status === 'scheduled').length,
    inProgress: filteredInspections.filter(i => i.status === 'in_progress').length,
    completed: filteredInspections.filter(i => i.status === 'completed').length,
    cancelled: filteredInspections.filter(i => i.status === 'cancelled' || i.status === 'postponed').length,
    all: filteredInspections.length,
  }), [filteredInspections]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Inspection Scheduling</h1>
            <p className="text-muted-foreground">Manage factory audits and quality inspections</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Inspection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Inspection</DialogTitle>
              </DialogHeader>
              <InspectionForm onClose={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{stats.upcoming}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
                <Loader2 className="h-8 w-8 text-amber-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & View Toggle */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {inspectionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="postponed">Postponed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('calendar')}
                  title="Calendar View"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('map')}
                  title="Map View"
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'calendar' ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Calendar */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {format(currentMonth, 'MMMM yyyy')}
                      </CardTitle>
                      {dragState.isDragging && (
                        <p className="text-sm text-primary mt-1 flex items-center gap-1">
                          <GripVertical className="h-3 w-3" />
                          Drop on a date to reschedule
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: monthDays[0].getDay() }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {monthDays.map(day => {
                      const dayInspections = getInspectionsForDate(day);
                      const isSelected = selectedDate && isSameDay(day, selectedDate);
                      const isToday = isSameDay(day, new Date(2026, 1, 4)); // Mock today as Feb 4, 2026
                      const dayKey = format(day, 'yyyy-MM-dd');

                      return (
                        <CalendarDayCell
                          key={dayKey}
                          day={day}
                          inspections={dayInspections}
                          isSelected={!!isSelected}
                          isToday={isToday}
                          isDragOver={isDragOver === dayKey}
                          isDragging={dragState.isDragging}
                          draggedInspectionId={dragState.draggedInspection?.id || null}
                          onSelect={setSelectedDate}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onDragOver={handleDragOverCell}
                          onDragLeave={handleDragLeaveCell}
                          onDrop={handleDropOnCell}
                        />
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                    {inspectionTypes.map(type => (
                      <div key={type.value} className="flex items-center gap-1.5 text-xs">
                        <div className={`w-2 h-2 rounded-full ${getTypeColor(type.value)}`} />
                        <span className="text-muted-foreground">{type.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Drag hint */}
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <GripVertical className="h-3 w-3" />
                      Drag inspection dots to reschedule (completed/cancelled cannot be moved)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Date Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a Date'}
                  </CardTitle>
                  <CardDescription>
                    {selectedDateInspections.length} inspection{selectedDateInspections.length !== 1 ? 's' : ''} scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedDateInspections.length > 0 ? (
                    selectedDateInspections.map(insp => (
                      <InspectionCard key={insp.id} inspection={insp} compact />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>No inspections scheduled</p>
                      {selectedDate && (
                        <Button variant="outline" size="sm" className="mt-3" onClick={() => setIsFormOpen(true)}>
                          <Plus className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-4 flex-wrap h-auto gap-1">
                  <TabsTrigger value="upcoming" className="gap-2">
                    Upcoming
                    {tabCounts.upcoming > 0 && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs">{tabCounts.upcoming}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="in_progress" className="gap-2">
                    In Progress
                    {tabCounts.inProgress > 0 && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-amber-100 text-amber-700">{tabCounts.inProgress}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="gap-2">
                    Completed
                    {tabCounts.completed > 0 && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-emerald-100 text-emerald-700">{tabCounts.completed}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="cancelled" className="gap-2">
                    Cancelled/Postponed
                    {tabCounts.cancelled > 0 && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs">{tabCounts.cancelled}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="all" className="gap-2">
                    All
                    <Badge variant="outline" className="h-5 px-1.5 text-xs">{tabCounts.all}</Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  {tabCounts.upcoming > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(() => {
                          const upcomingInspections = filteredInspections
                            .filter(i => i.status === 'scheduled')
                            .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
                          const displayCount = 6;
                          const hasMore = upcomingInspections.length > displayCount;
                          const displayed = (newNavEnabled && !showAllInspections && hasMore)
                            ? upcomingInspections.slice(0, displayCount)
                            : upcomingInspections;
                          return displayed.map(insp => (
                            <InspectionCard key={insp.id} inspection={insp} />
                          ));
                        })()}
                      </div>
                      {newNavEnabled && (() => {
                        const upcomingInspections = filteredInspections.filter(i => i.status === 'scheduled');
                        const displayCount = 6;
                        const hasMore = upcomingInspections.length > displayCount;
                        const hiddenCount = upcomingInspections.length - displayCount;
                        return hasMore ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAllInspections(!showAllInspections)}
                            className="w-full mt-4 text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-primary/30"
                          >
                            {showAllInspections ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Show fewer inspections
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                Show more inspections ({hiddenCount} more)
                              </>
                            )}
                          </Button>
                        ) : null;
                      })()}
                    </>
                  ) : (
                    <Card className="py-12">
                      <div className="text-center text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No upcoming inspections</p>
                        <p className="text-sm mt-1">Schedule a new inspection to get started</p>
                        <Button variant="outline" className="mt-4" onClick={() => setIsFormOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule Inspection
                        </Button>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="in_progress">
                  {tabCounts.inProgress > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredInspections
                        .filter(i => i.status === 'in_progress')
                        .map(insp => (
                          <InspectionCard key={insp.id} inspection={insp} />
                        ))}
                    </div>
                  ) : (
                    <Card className="py-12">
                      <div className="text-center text-muted-foreground">
                        <Loader2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No inspections in progress</p>
                        <p className="text-sm mt-1">Inspections will appear here once they begin</p>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="completed">
                  {tabCounts.completed > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredInspections
                        .filter(i => i.status === 'completed')
                        .sort((a, b) => new Date(b.completedAt || b.scheduledDate).getTime() - new Date(a.completedAt || a.scheduledDate).getTime())
                        .map(insp => (
                          <InspectionCard key={insp.id} inspection={insp} />
                        ))}
                    </div>
                  ) : (
                    <Card className="py-12">
                      <div className="text-center text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No completed inspections</p>
                        <p className="text-sm mt-1">Completed inspections will appear here</p>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="cancelled">
                  {tabCounts.cancelled > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredInspections
                        .filter(i => i.status === 'cancelled' || i.status === 'postponed')
                        .map(insp => (
                          <InspectionCard key={insp.id} inspection={insp} />
                        ))}
                    </div>
                  ) : (
                    <Card className="py-12">
                      <div className="text-center text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No cancelled or postponed inspections</p>
                        <p className="text-sm mt-1">That's great news!</p>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="all">
                  {tabCounts.all > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(() => {
                          const allInspections = filteredInspections
                            .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
                          const displayCount = 6;
                          const hasMore = allInspections.length > displayCount;
                          const displayed = (newNavEnabled && !showAllInspections && hasMore)
                            ? allInspections.slice(0, displayCount)
                            : allInspections;
                          return displayed.map(insp => (
                            <InspectionCard key={insp.id} inspection={insp} />
                          ));
                        })()}
                      </div>
                      {newNavEnabled && (() => {
                        const allInspections = filteredInspections;
                        const displayCount = 6;
                        const hasMore = allInspections.length > displayCount;
                        const hiddenCount = allInspections.length - displayCount;
                        return hasMore ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAllInspections(!showAllInspections)}
                            className="w-full mt-4 text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-primary/30"
                          >
                            {showAllInspections ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Show fewer inspections
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                Show more inspections ({hiddenCount} more)
                              </>
                            )}
                          </Button>
                        ) : null;
                      })()}
                    </>
                  ) : (
                    <Card className="py-12">
                      <div className="text-center text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No inspections found</p>
                        <p className="text-sm mt-1">Try adjusting your filters</p>
                      </div>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : viewMode === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FactoryMapView 
                inspections={filteredInspections}
                initialOpenFactoryId={initialFactoryId}
                onFactoryClick={(factoryId) => {
                  // Filter to show only inspections for this factory
                  const factoryInspections = filteredInspections.filter(i => i.factoryId === factoryId);
                  if (factoryInspections.length > 0) {
                    toast.info(`${factoryInspections.length} inspection(s) at this factory`);
                  }
                }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Inspections;
