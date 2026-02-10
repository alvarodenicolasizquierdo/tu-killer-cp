import { useState, useMemo, useCallback, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid3X3, List, Package, AlertTriangle, CheckCircle2, Clock, ChevronRight, Download, RefreshCw, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { mockProducts, mockSuppliers } from '@/data/mockData';
import { Product } from '@/types';
import { CSVImportDialog } from '@/components/products/CSVImportDialog';

const Products = () => {
  const navigate = useNavigate();
  useEffect(() => { tagScreen('portal-products'); }, []);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [supplierFilter, setSupplierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = [...new Set(mockProducts.map(p => p.category))];
    return cats.sort();
  }, []);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesSupplier = supplierFilter === 'all' || product.supplierId === supplierFilter;
      const matchesStatus = statusFilter === 'all' || product.complianceStatus === statusFilter;

      return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
    });
  }, [searchQuery, categoryFilter, supplierFilter, statusFilter]);

  const isAllSelected = filteredProducts.length > 0 && filteredProducts.every(p => selectedProducts.has(p.id));
  const isSomeSelected = selectedProducts.size > 0;

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  }, [isAllSelected, filteredProducts]);

  const toggleSelectProduct = useCallback((productId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedProducts(new Set());
  }, []);

  const exportToCSV = useCallback(() => {
    const productsToExport = selectedProducts.size > 0 
      ? filteredProducts.filter(p => selectedProducts.has(p.id))
      : filteredProducts;

    const headers = ['Product Code', 'Name', 'Category', 'Supplier', 'Compliance Status', 'Pass Rate', 'Risk Score', 'Active TRFs', 'Last Tested'];
    
    const csvContent = [
      headers.join(','),
      ...productsToExport.map(p => [
        p.code,
        `"${p.name.replace(/"/g, '""')}"`,
        p.category,
        `"${p.supplier.replace(/"/g, '""')}"`,
        p.complianceStatus.replace('_', ' '),
        p.passRate,
        p.riskScore,
        p.activeTRFs,
        p.lastTested || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export Complete',
      description: `${productsToExport.length} product(s) exported to CSV.`,
    });
  }, [selectedProducts, filteredProducts, toast]);

  const handleBatchStatusUpdate = useCallback((newStatus: Product['complianceStatus']) => {
    const count = selectedProducts.size;
    const statusLabel = newStatus.replace('_', ' ');
    
    // In a real app, this would make API calls to update the products
    toast({
      title: 'Status Updated',
      description: `${count} product(s) marked as ${statusLabel}.`,
    });
    
    clearSelection();
  }, [selectedProducts, toast, clearSelection]);

  const handleCSVImport = useCallback((products: { code: string; name: string; category: string; supplier: string; complianceStatus: Product['complianceStatus'] }[]) => {
    // In a real app, this would make API calls to create the products
    console.log('Importing products:', products);
    // The toast is shown by the dialog component
  }, []);

  const getComplianceColor = (status: Product['complianceStatus']) => {
    switch (status) {
      case 'compliant': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'pending_review': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'non_compliant': return 'bg-red-500/10 text-red-600 border-red-200';
    }
  };

  const getComplianceIcon = (status: Product['complianceStatus']) => {
    switch (status) {
      case 'compliant': return <CheckCircle2 className="h-3.5 w-3.5" />;
      case 'pending_review': return <Clock className="h-3.5 w-3.5" />;
      case 'non_compliant': return <AlertTriangle className="h-3.5 w-3.5" />;
    }
  };

  const getComplianceLabel = (status: Product['complianceStatus']) => {
    switch (status) {
      case 'compliant': return 'Compliant';
      case 'pending_review': return 'Pending Review';
      case 'non_compliant': return 'Non-Compliant';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const isSelected = selectedProducts.has(product.id);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -2 }}
        className="cursor-pointer relative"
      >
        <Card 
          className={`h-full hover:shadow-lg transition-all duration-200 ${
            isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/30'
          }`}
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {/* Selection Checkbox */}
          <div 
            className="absolute top-3 left-3 z-10"
            onClick={(e) => toggleSelectProduct(product.id, e)}
          >
            <Checkbox 
              checked={isSelected}
              className="bg-background"
            />
          </div>
          
          <CardHeader className="pb-3 pl-10">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-semibold line-clamp-2">{product.name}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1 font-mono">{product.code}</p>
              </div>
              <Badge 
                variant="outline" 
                className={`shrink-0 flex items-center gap-1 ${getComplianceColor(product.complianceStatus)}`}
              >
                {getComplianceIcon(product.complianceStatus)}
                <span className="hidden sm:inline">{getComplianceLabel(product.complianceStatus)}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span className="truncate">{product.supplier}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Category</span>
              <Badge variant="secondary" className="text-xs">{product.category}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pass Rate</span>
                <span className="font-medium">{product.passRate}%</span>
              </div>
              <Progress value={product.passRate} className="h-1.5" />
            </div>

            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Risk Score</span>
                <span className={`font-semibold ${getRiskColor(product.riskScore)}`}>{product.riskScore}</span>
              </div>
              {product.activeTRFs > 0 && (
                <Badge variant="outline" className="text-xs">
                  {product.activeTRFs} Active TRF{product.activeTRFs > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const ProductRow = ({ product }: { product: Product }) => {
    const isSelected = selectedProducts.has(product.id);
    
    return (
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`cursor-pointer transition-colors ${
          isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'
        }`}
      >
        <td className="p-4" onClick={(e) => toggleSelectProduct(product.id, e)}>
          <Checkbox checked={isSelected} />
        </td>
        <td className="p-4" onClick={() => navigate(`/products/${product.id}`)}>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{product.code}</p>
          </div>
        </td>
        <td className="p-4" onClick={() => navigate(`/products/${product.id}`)}>
          <Badge variant="secondary" className="text-xs">{product.category}</Badge>
        </td>
        <td className="p-4 text-sm text-muted-foreground" onClick={() => navigate(`/products/${product.id}`)}>{product.supplier}</td>
        <td className="p-4" onClick={() => navigate(`/products/${product.id}`)}>
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 w-fit ${getComplianceColor(product.complianceStatus)}`}
          >
            {getComplianceIcon(product.complianceStatus)}
            {getComplianceLabel(product.complianceStatus)}
          </Badge>
        </td>
        <td className="p-4" onClick={() => navigate(`/products/${product.id}`)}>
          <div className="flex items-center gap-2">
            <Progress value={product.passRate} className="h-1.5 w-16" />
            <span className="text-sm font-medium">{product.passRate}%</span>
          </div>
        </td>
        <td className="p-4" onClick={() => navigate(`/products/${product.id}`)}>
          <span className={`font-semibold ${getRiskColor(product.riskScore)}`}>{product.riskScore}</span>
        </td>
        <td className="p-4" onClick={() => navigate(`/products/${product.id}`)}>
          {product.activeTRFs > 0 ? (
            <Badge variant="outline" className="text-xs">{product.activeTRFs}</Badge>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </td>
        <td className="p-4" onClick={() => navigate(`/products/${product.id}`)}>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </td>
      </motion.tr>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Product Catalog</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
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

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {isSomeSelected && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-primary bg-primary/5">
                <CardContent className="p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" onClick={clearSelection}>
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                      <span className="text-sm font-medium">
                        {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Update Status
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleBatchStatusUpdate('compliant')}>
                            <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
                            Mark as Compliant
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBatchStatusUpdate('pending_review')}>
                            <Clock className="h-4 w-4 mr-2 text-amber-600" />
                            Mark as Pending Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBatchStatusUpdate('non_compliant')}>
                            <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                            Mark as Non-Compliant
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button size="sm" onClick={exportToCSV}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Selected
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name, code, or supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    {mockSuppliers.map(sup => (
                      <SelectItem key={sup.id} value={sup.id}>{sup.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Display */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Select All for Grid */}
              <div className="flex items-center gap-3 mb-4">
                <Checkbox 
                  checked={isAllSelected} 
                  onCheckedChange={toggleSelectAll}
                  id="select-all-grid"
                />
                <label htmlFor="select-all-grid" className="text-sm text-muted-foreground cursor-pointer">
                  Select all {filteredProducts.length} products
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card>
                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 touch-pan-x">
                  <table className="w-full min-w-[800px] md:min-w-0">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 md:p-4 w-10">
                          <Checkbox 
                            checked={isAllSelected} 
                            onCheckedChange={toggleSelectAll}
                          />
                        </th>
                        <th className="p-3 md:p-4 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">Product</th>
                        <th className="p-3 md:p-4 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">Category</th>
                        <th className="p-3 md:p-4 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">Supplier</th>
                        <th className="p-3 md:p-4 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">Status</th>
                        <th className="p-3 md:p-4 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">Pass Rate</th>
                        <th className="p-3 md:p-4 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">Risk</th>
                        <th className="p-3 md:p-4 text-left text-sm font-medium text-muted-foreground whitespace-nowrap">TRFs</th>
                        <th className="p-3 md:p-4 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(product => (
                        <ProductRow key={product.id} product={product} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <Card className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </Card>
        )}

        {/* CSV Import Dialog */}
        <CSVImportDialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
          onImport={handleCSVImport}
        />
      </div>
    </AppLayout>
  );
};

export default Products;
