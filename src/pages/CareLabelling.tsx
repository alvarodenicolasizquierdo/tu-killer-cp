import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Tag, 
  Plus, 
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Eye,
  Edit2,
  Package
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AIAssistPanel } from '@/components/ai/AIAssistPanel';
import { mockCollections, careSymbols } from '@/data/stylesData';
import { cn } from '@/lib/utils';
import { AIAssistSuggestion, CareSymbol } from '@/types/styles';
import { Link } from 'react-router-dom';

export default function CareLabelling() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);

  // Filter collections
  const filteredCollections = useMemo(() => {
    return mockCollections.filter(collection => {
      const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  // Collections with/without care labels
  const collectionsWithLabels = filteredCollections.filter(c => c.careLabelPackage?.isComplete);
  const collectionsNeedingLabels = filteredCollections.filter(c => !c.careLabelPackage || !c.careLabelPackage.isComplete);

  // AI suggestions
  const aiSuggestions: AIAssistSuggestion[] = useMemo(() => {
    const suggestions: AIAssistSuggestion[] = [];

    // Suggest care labels for collections without
    if (collectionsNeedingLabels.length > 0) {
      suggestions.push({
        id: 'missing-labels',
        type: 'care_label',
        title: `${collectionsNeedingLabels.length} collections need care labels`,
        description: 'AI can pre-fill based on component materials',
        confidence: 85,
        reasoning: [
          'Care labels are required before GSW submission',
          'AI analyzes fabric composition to suggest symbols',
          'Similar materials typically use the same care instructions'
        ],
        action: { label: 'Auto-fill Labels', type: 'apply' }
      });
    }

    // Consistency check
    suggestions.push({
      id: 'consistency-check',
      type: 'care_label',
      title: 'Care label consistency check',
      description: 'Verify symbols match across similar products',
      confidence: 78,
      reasoning: [
        'Products with similar compositions should have matching care',
        '2 potential inconsistencies detected',
        'Review recommended before final approval'
      ],
      action: { label: 'Review', type: 'apply' }
    });

    return suggestions;
  }, [collectionsNeedingLabels]);

  const toggleSymbol = (symbolId: string) => {
    setSelectedSymbols(prev => 
      prev.includes(symbolId) 
        ? prev.filter(id => id !== symbolId)
        : [...prev, symbolId]
    );
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Care Labelling</h1>
          <p className="text-muted-foreground">Manage care symbols and washing instructions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-ai-primary to-ai-secondary hover:opacity-90">
              <Plus className="w-4 h-4" />
              Create Care Package
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Care Label Package</DialogTitle>
              <DialogDescription>
                Select care symbols and add washing instructions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div>
                <label className="text-sm font-medium mb-3 block">Care Symbols</label>
                <div className="grid grid-cols-4 gap-3">
                  {careSymbols.map((symbol) => (
                    <Tooltip key={symbol.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => toggleSymbol(symbol.id)}
                          className={cn(
                            "w-14 h-14 rounded-lg border-2 flex items-center justify-center text-2xl transition-all",
                            selectedSymbols.includes(symbol.id)
                              ? "border-primary bg-primary/10"
                              : "border-muted hover:border-primary/50"
                          )}
                        >
                          {symbol.icon}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{symbol.description}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Care Wording</label>
                <Textarea 
                  placeholder="Enter care instructions (e.g., Machine wash cold with similar colors...)"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hanger Spec Reference</label>
                  <Input placeholder="e.g., HS-TSHIRT-M" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Label Instruction Ref</label>
                  <Input placeholder="e.g., LI-2026-001" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Create Package
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Tag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockCollections.length}</p>
                <p className="text-xs text-muted-foreground">Total Collections</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{collectionsWithLabels.length}</p>
                <p className="text-xs text-muted-foreground">Complete</p>
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
                <p className="text-2xl font-bold text-amber-600">{collectionsNeedingLabels.length}</p>
                <p className="text-xs text-muted-foreground">Needs Labels</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{careSymbols.length}</p>
                <p className="text-xs text-muted-foreground">Available Symbols</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Collections needing labels */}
          {collectionsNeedingLabels.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-base">Pending Care Labels</CardTitle>
                </div>
                <CardDescription>Collections that need care label packages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {collectionsNeedingLabels.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/styles/${collection.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium">{collection.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {collection.supplierName} • {collection.season}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Plus className="w-3.5 h-3.5" />
                          Add Labels
                        </Button>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Collections with labels */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <CardTitle className="text-base">Complete Care Labels</CardTitle>
              </div>
              <CardDescription>Collections with care label packages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {collectionsWithLabels.length === 0 ? (
                <div className="text-center py-8">
                  <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No collections have complete care labels yet</p>
                </div>
              ) : (
                collectionsWithLabels.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/styles/${collection.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium">{collection.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {collection.supplierName} • {collection.season}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {collection.careLabelPackage?.symbols.slice(0, 4).map((symbol) => (
                              <Tooltip key={symbol.id}>
                                <TooltipTrigger>
                                  <span className="text-lg">{symbol.icon}</span>
                                </TooltipTrigger>
                                <TooltipContent>{symbol.description}</TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                          <Button size="sm" variant="ghost" className="gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Assist Panel */}
        <div className="space-y-4">
          <AIAssistPanel
            suggestions={aiSuggestions}
            context="Care Label Assistant"
            onApplySuggestion={(s) => console.log('Applied:', s)}
            onDismissSuggestion={(s) => console.log('Dismissed:', s)}
          />

          {/* Symbol Reference */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Care Symbol Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {careSymbols.map((symbol) => (
                  <Tooltip key={symbol.id}>
                    <TooltipTrigger>
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl cursor-help">
                        {symbol.icon}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{symbol.code}</p>
                      <p className="text-xs">{symbol.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
