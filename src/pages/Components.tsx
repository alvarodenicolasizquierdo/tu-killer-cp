import { useState, useMemo, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Package,
  Factory,
  Percent,
  Link2
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AIAssistPanel } from '@/components/ai/AIAssistPanel';
import { mockComponents, mockCollections } from '@/data/stylesData';
import { cn } from '@/lib/utils';
import { Component, ComponentType, AIAssistSuggestion } from '@/types/styles';

export default function Components() {
  useEffect(() => { tagScreen('portal-components'); }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredComponents = useMemo(() => {
    return mockComponents.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.composition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || component.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, typeFilter]);

  // Count how many collections use each component
  const componentUsage = useMemo(() => {
    const usage: Record<string, number> = {};
    mockComponents.forEach(c => {
      usage[c.id] = mockCollections.filter(coll => coll.componentIds.includes(c.id)).length;
    });
    return usage;
  }, []);

  // AI suggestions
  const aiSuggestions: AIAssistSuggestion[] = useMemo(() => {
    const suggestions: AIAssistSuggestion[] = [];

    // Check for components with high area that might need full testing
    const highAreaComponents = mockComponents.filter(c => c.areaPercentage > 10 && !c.riskAssessmentRequired);
    if (highAreaComponents.length > 0) {
      suggestions.push({
        id: 'high-area-warning',
        type: 'approval_block',
        title: `${highAreaComponents.length} component(s) may need risk assessment`,
        description: 'Components >10% area typically require full testing',
        confidence: 92,
        reasoning: [
          'Components covering >10% of product area require comprehensive testing',
          'Missing risk assessments can block Base approval',
          `Affected: ${highAreaComponents.map(c => c.name).slice(0, 2).join(', ')}...`
        ]
      });
    }

    // Suggest common components for new products
    suggestions.push({
      id: 'suggest-common',
      type: 'component_set',
      title: 'Most used components this season',
      description: 'Quick-add frequently linked components',
      confidence: 78,
      reasoning: [
        'Organic Cotton Jersey used in 4 collections',
        'Cotton Rib 1x1 used in 3 collections',
        'Saves time when setting up new styles'
      ],
      action: { label: 'View Popular', type: 'apply' }
    });

    return suggestions;
  }, []);

  // Stats
  const stats = useMemo(() => ({
    total: mockComponents.length,
    fabric: mockComponents.filter(c => c.type === 'Fabric').length,
    trim: mockComponents.filter(c => c.type === 'Trim').length,
    lining: mockComponents.filter(c => c.type === 'Lining').length,
    fullTestingRequired: mockComponents.filter(c => c.riskAssessmentRequired).length
  }), []);

  const getTypeColor = (type: ComponentType) => {
    const colors: Record<ComponentType, string> = {
      Fabric: 'bg-blue-100 text-blue-700',
      Trim: 'bg-purple-100 text-purple-700',
      Lining: 'bg-teal-100 text-teal-700',
      Pocketing: 'bg-amber-100 text-amber-700',
      Other: 'bg-gray-100 text-gray-700'
    };
    return colors[type];
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Component Library</h1>
          <p className="text-muted-foreground">Manage fabric, trim, and material components</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-ai-primary to-ai-secondary hover:opacity-90">
              <Plus className="w-4 h-4" />
              New Component
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Component</DialogTitle>
              <DialogDescription>
                Add a new material component to the library
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Component Name</Label>
                <Input placeholder="e.g., Organic Cotton Jersey 180gsm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select defaultValue="Fabric">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fabric">Fabric</SelectItem>
                      <SelectItem value="Trim">Trim</SelectItem>
                      <SelectItem value="Lining">Lining</SelectItem>
                      <SelectItem value="Pocketing">Pocketing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Area %</Label>
                  <Input type="number" placeholder="e.g., 85" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Composition</Label>
                <Input placeholder="e.g., 100% Organic Cotton" />
              </div>
              <div className="space-y-2">
                <Label>Construction</Label>
                <Input placeholder="e.g., Single Jersey Knit" />
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier-001">Textile Supplier Ltd</SelectItem>
                    <SelectItem value="supplier-002">Denim Masters Co</SelectItem>
                    <SelectItem value="supplier-003">EcoTextile Inc</SelectItem>
                    <SelectItem value="supplier-004">ActiveWear Partners</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Create Component
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.fabric}</p>
                <p className="text-xs text-muted-foreground">Fabric</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Layers className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.trim}</p>
                <p className="text-xs text-muted-foreground">Trim</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                <Layers className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-600">{stats.lining}</p>
                <p className="text-xs text-muted-foreground">Lining</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.fullTestingRequired}</p>
                <p className="text-xs text-muted-foreground">Full Test Req.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search components, materials, suppliers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Fabric">Fabric</SelectItem>
                    <SelectItem value="Trim">Trim</SelectItem>
                    <SelectItem value="Lining">Lining</SelectItem>
                    <SelectItem value="Pocketing">Pocketing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-1 border rounded-md p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Components Grid/List */}
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 gap-4" 
              : "space-y-3"
          )}>
            {filteredComponents.map((component, index) => (
              <motion.div
                key={component.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                  <CardContent className={cn("p-4", viewMode === 'list' && "flex items-center gap-4")}>
                    {/* Header */}
                    <div className={cn("flex items-start gap-3", viewMode === 'list' && "flex-1")}>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Layers className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{component.name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">{component.composition}</p>
                      </div>
                      <Badge className={cn("shrink-0", getTypeColor(component.type))}>
                        {component.type}
                      </Badge>
                    </div>

                    {viewMode === 'grid' && (
                      <>
                        {/* Details */}
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Construction</span>
                            <span>{component.construction}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Area</span>
                            <div className="flex items-center gap-1">
                              <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className={cn(
                                component.areaPercentage > 10 ? "text-amber-600 font-medium" : ""
                              )}>
                                {component.areaPercentage}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Supplier</span>
                            <span className="flex items-center gap-1">
                              <Factory className="w-3.5 h-3.5 text-muted-foreground" />
                              {component.supplierName}
                            </span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {component.riskAssessmentRequired && (
                              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                Full Testing
                              </Badge>
                            )}
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Link2 className="w-3.5 h-3.5" />
                              {componentUsage[component.id]} collections
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {viewMode === 'list' && (
                      <div className="flex items-center gap-6">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Area: </span>
                          <span className={cn(
                            component.areaPercentage > 10 ? "text-amber-600 font-medium" : ""
                          )}>{component.areaPercentage}%</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Supplier: </span>
                          <span>{component.supplierName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Link2 className="w-3.5 h-3.5" />
                          {componentUsage[component.id]} collections
                        </div>
                        {component.riskAssessmentRequired && (
                          <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                            Full Testing
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredComponents.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-1">No components found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or create a new component</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Assist Panel */}
        <div className="space-y-4">
          <AIAssistPanel
            suggestions={aiSuggestions}
            context="Component Insights"
            onApplySuggestion={(s) => console.log('Applied:', s)}
            onDismissSuggestion={(s) => console.log('Dismissed:', s)}
          />

          {/* Usage Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Most Used Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockComponents
                .sort((a, b) => componentUsage[b.id] - componentUsage[a.id])
                .slice(0, 5)
                .map(component => (
                  <div key={component.id} className="flex items-center justify-between text-sm">
                    <span className="truncate">{component.name}</span>
                    <Badge variant="secondary">{componentUsage[component.id]}</Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
