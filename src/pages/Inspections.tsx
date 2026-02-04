import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, List, Grid3X3, MapPin, Clock, User, Building2, Filter, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockInspections, mockSuppliers } from '@/data/mockData';
import { Inspection, InspectionType, InspectionStatus } from '@/types';
import InspectionForm from '@/components/inspections/InspectionForm';
import InspectionCard from '@/components/inspections/InspectionCard';

const Inspections = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1)); // Feb 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const inspectionTypes: { value: InspectionType; label: string }[] = [
    { value: 'factory_audit', label: 'Factory Audit' },
    { value: 'quality_check', label: 'Quality Check' },
    { value: 'social_compliance', label: 'Social Compliance' },
    { value: 'environmental', label: 'Environmental' },
    { value: 'pre_shipment', label: 'Pre-Shipment' },
  ];

  const filteredInspections = useMemo(() => {
    return mockInspections.filter(insp => {
      const matchesType = typeFilter === 'all' || insp.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || insp.status === statusFilter;
      return matchesType && matchesStatus;
    });
  }, [typeFilter, statusFilter]);

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getInspectionsForDate = (date: Date) => {
    return filteredInspections.filter(insp => 
      isSameDay(parseISO(insp.scheduledDate), date)
    );
  };

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

  // Stats
  const stats = useMemo(() => {
    const upcoming = mockInspections.filter(i => i.status === 'scheduled').length;
    const inProgress = mockInspections.filter(i => i.status === 'in_progress').length;
    const completed = mockInspections.filter(i => i.status === 'completed').length;
    const critical = mockInspections.filter(i => i.priority === 'critical' && i.status !== 'completed').length;
    return { upcoming, inProgress, completed, critical };
  }, []);

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
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
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
                    <CardTitle className="text-lg">
                      {format(currentMonth, 'MMMM yyyy')}
                    </CardTitle>
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

                      return (
                        <motion.button
                          key={day.toISOString()}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDate(day)}
                          className={`
                            aspect-square p-1 rounded-lg border transition-all
                            ${isSelected ? 'border-primary bg-primary/10' : 'border-transparent hover:border-border'}
                            ${isToday ? 'bg-accent' : ''}
                          `}
                        >
                          <div className="h-full flex flex-col">
                            <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>
                              {format(day, 'd')}
                            </span>
                            {dayInspections.length > 0 && (
                              <div className="flex-1 flex flex-wrap gap-0.5 mt-1 overflow-hidden">
                                {dayInspections.slice(0, 3).map(insp => (
                                  <div
                                    key={insp.id}
                                    className={`w-1.5 h-1.5 rounded-full ${getTypeColor(insp.type)}`}
                                  />
                                ))}
                                {dayInspections.length > 3 && (
                                  <span className="text-[10px] text-muted-foreground">+{dayInspections.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.button>
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
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredInspections
                      .filter(i => i.status === 'scheduled')
                      .map(insp => (
                        <InspectionCard key={insp.id} inspection={insp} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="in_progress">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredInspections
                      .filter(i => i.status === 'in_progress')
                      .map(insp => (
                        <InspectionCard key={insp.id} inspection={insp} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="completed">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredInspections
                      .filter(i => i.status === 'completed')
                      .map(insp => (
                        <InspectionCard key={insp.id} inspection={insp} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredInspections.map(insp => (
                      <InspectionCard key={insp.id} inspection={insp} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Inspections;
