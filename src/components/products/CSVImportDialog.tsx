import { useState, useCallback, useRef } from 'react';
import { tagEvent } from '@/utils/clarityTracking';
import { Upload, FileText, AlertCircle, CheckCircle2, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

interface ParsedProduct {
  code: string;
  name: string;
  category: string;
  supplier: string;
  complianceStatus: Product['complianceStatus'];
  isValid: boolean;
  errors: string[];
}

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (products: ParsedProduct[]) => void;
}

const REQUIRED_COLUMNS = ['Product Code', 'Name', 'Category', 'Supplier'];
const VALID_STATUSES = ['compliant', 'pending_review', 'non_compliant'];

const SAMPLE_CSV = `Product Code,Name,Category,Supplier,Compliance Status
PROD-001,Example Widget,Electronics,Acme Corp,pending_review
PROD-002,Sample Gadget,Apparel,Global Textiles,compliant`;

export const CSVImportDialog = ({ open, onOpenChange, onImport }: CSVImportDialogProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview'>('upload');

  const resetState = useCallback(() => {
    setFile(null);
    setParsedProducts([]);
    setParseErrors([]);
    setStep('upload');
    setIsProcessing(false);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onOpenChange(false);
  }, [resetState, onOpenChange]);

  const parseCSV = useCallback((text: string): { products: ParsedProduct[]; errors: string[] } => {
    const lines = text.trim().split('\n');
    const errors: string[] = [];
    const products: ParsedProduct[] = [];

    if (lines.length < 2) {
      errors.push('CSV file must have a header row and at least one data row');
      return { products, errors };
    }

    // Parse header
    const header = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const columnMap: Record<string, number> = {};
    
    header.forEach((col, idx) => {
      columnMap[col] = idx;
    });

    // Validate required columns
    const missingColumns = REQUIRED_COLUMNS.filter(col => !(col in columnMap));
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
      return { products, errors };
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle quoted values with commas
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/^"|"$/g, ''));

      const rowErrors: string[] = [];
      const code = values[columnMap['Product Code']] || '';
      const name = values[columnMap['Name']] || '';
      const category = values[columnMap['Category']] || '';
      const supplier = values[columnMap['Supplier']] || '';
      const statusRaw = values[columnMap['Compliance Status']] || 'pending_review';
      const status = statusRaw.toLowerCase().replace(/\s+/g, '_');

      if (!code) rowErrors.push('Missing product code');
      if (!name) rowErrors.push('Missing name');
      if (!category) rowErrors.push('Missing category');
      if (!supplier) rowErrors.push('Missing supplier');
      if (statusRaw && !VALID_STATUSES.includes(status)) {
        rowErrors.push(`Invalid status: ${statusRaw}`);
      }

      products.push({
        code,
        name,
        category,
        supplier,
        complianceStatus: VALID_STATUSES.includes(status) 
          ? status as Product['complianceStatus'] 
          : 'pending_review',
        isValid: rowErrors.length === 0,
        errors: rowErrors,
      });
    }

    return { products, errors };
  }, []);

  const processFile = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setParseErrors([]);

    try {
      const text = await selectedFile.text();
      const { products, errors } = parseCSV(text);
      
      setParsedProducts(products);
      setParseErrors(errors);
      
      if (errors.length === 0 && products.length > 0) {
        setStep('preview');
      }
    } catch (err) {
      setParseErrors(['Failed to read file. Please ensure it is a valid CSV file.']);
    } finally {
      setIsProcessing(false);
    }
  }, [parseCSV]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
      processFile(droppedFile);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV file.',
        variant: 'destructive',
      });
    }
  }, [processFile, toast]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  }, [processFile]);

  const downloadTemplate = useCallback(() => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'product-import-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleImport = useCallback(() => {
    const validProducts = parsedProducts.filter(p => p.isValid);
    onImport(validProducts);
    tagEvent('csv_import_complete', String(validProducts.length));
    
    toast({
      title: 'Import Successful',
      description: `${validProducts.length} product(s) imported successfully.`,
    });
    
    handleClose();
  }, [parsedProducts, onImport, toast, handleClose]);

  const validCount = parsedProducts.filter(p => p.isValid).length;
  const invalidCount = parsedProducts.filter(p => !p.isValid).length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Products from CSV
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import products into the catalog.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-colors duration-200
                  ${isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {isProcessing ? (
                  <div className="space-y-3">
                    <div className="animate-spin mx-auto h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                    <p className="text-sm text-muted-foreground">Processing file...</p>
                  </div>
                ) : (
                  <>
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="font-medium">Drop your CSV file here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse
                    </p>
                  </>
                )}
              </div>

              {/* Parse Errors */}
              {parseErrors.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium text-destructive">File Error</p>
                      {parseErrors.map((error, idx) => (
                        <p key={idx} className="text-sm text-destructive/80">{error}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Template Download */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="text-sm">
                  <p className="font-medium">Need a template?</p>
                  <p className="text-muted-foreground">Download our sample CSV format</p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Template
                </Button>
              </div>

              {/* Required Columns Info */}
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">Required columns:</p>
                <div className="flex flex-wrap gap-2">
                  {REQUIRED_COLUMNS.map(col => (
                    <Badge key={col} variant="secondary">{col}</Badge>
                  ))}
                  <Badge variant="outline">Compliance Status (optional)</Badge>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Summary */}
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium truncate max-w-[200px]">{file?.name}</span>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    {validCount} valid
                  </Badge>
                  {invalidCount > 0 && (
                    <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 mr-1" />
                      {invalidCount} errors
                    </Badge>
                  )}
                </div>
              </div>

              {/* Preview Table */}
              <ScrollArea className="h-[300px] border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Code</th>
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Category</th>
                      <th className="text-left p-3 font-medium">Supplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedProducts.map((product, idx) => (
                      <tr 
                        key={idx} 
                        className={`border-t ${!product.isValid ? 'bg-red-500/5' : ''}`}
                      >
                        <td className="p-3">
                          {product.isValid ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <div className="flex items-center gap-1">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-xs text-red-600 truncate max-w-[100px]">
                                {product.errors[0]}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-mono text-xs">{product.code || '-'}</td>
                        <td className="p-3">{product.name || '-'}</td>
                        <td className="p-3">{product.category || '-'}</td>
                        <td className="p-3">{product.supplier || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Import progress</span>
                  <span className="font-medium">{validCount} of {parsedProducts.length} ready</span>
                </div>
                <Progress value={(validCount / parsedProducts.length) * 100} className="h-2" />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={resetState}>
                  <X className="h-4 w-4 mr-2" />
                  Choose Different File
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={validCount === 0}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import {validCount} Product{validCount !== 1 ? 's' : ''}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
