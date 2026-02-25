import { AppLayout } from '@/components/layout/AppLayout';
import { mockSuppliers } from '@/data/mockData';
import { Supplier } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Factory, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  ClipboardList,
  Mail,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

function SupplierCard({ supplier, index }: { supplier: Supplier; index: number }) {
  const statusConfig = {
    active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
    'at-risk': { label: 'At Risk', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertTriangle },
    inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: AlertTriangle },
  };

  const status = statusConfig[supplier.status];
  const StatusIcon = status.icon;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const handleInviteToQuestionnaire = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Mock email sending simulation
    toast({
      title: "Invitation Sent",
      description: (
        <div className="flex flex-col gap-1">
          <span>Questionnaire invitation sent to <strong>{supplier.contactPerson}</strong></span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {supplier.email}
          </span>
        </div>
      ),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold",
                supplier.status === 'active' && "bg-emerald-100 text-emerald-700",
                supplier.status === 'at-risk' && "bg-amber-100 text-amber-700",
                supplier.status === 'inactive' && "bg-gray-100 text-gray-700"
              )}>
                {supplier.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {supplier.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {supplier.country}
                  <span className="text-muted">•</span>
                  <Factory className="w-3 h-3" />
                  {supplier.factoryCount} {supplier.factoryCount === 1 ? 'Factory' : 'Factories'}
                </div>
              </div>
            </div>
            <Badge variant="outline" className={cn("gap-1", status.color)}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </Badge>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Compliance</p>
              <p className={cn("text-xl font-bold", getScoreColor(supplier.complianceScore))}>
                {supplier.complianceScore}%
              </p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Quality</p>
              <p className={cn("text-xl font-bold", getScoreColor(supplier.qualityScore))}>
                {supplier.qualityScore}%
              </p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Delivery</p>
              <p className={cn("text-xl font-bold", getScoreColor(supplier.deliveryScore))}>
                {supplier.deliveryScore}%
              </p>
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{supplier.openTRFs} Open TRFs</span>
              </div>
              {supplier.certificatesExpiring > 0 && (
                <div className="flex items-center gap-1 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{supplier.certificatesExpiring} Cert{supplier.certificatesExpiring > 1 ? 's' : ''} Expiring</span>
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 text-xs h-7"
              onClick={handleInviteToQuestionnaire}
            >
              <Send className="w-3 h-3" />
              Invite to Questionnaire
            </Button>
          </div>
          {supplier.lastAudit && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
              <Calendar className="w-3 h-3" />
              Last audit: {new Date(supplier.lastAudit).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Suppliers() {
  return (
    <AppLayout title="Supplier Management" subtitle="Monitor supplier performance, compliance, and risk">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search suppliers, factories, countries..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
        <Button className="ai-gradient border-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Suppliers</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Factory className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-emerald-600">21</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold text-amber-600">2</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <div className="flex items-center text-emerald-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm ml-1">+3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Questionnaire CTA */}
      <Card className="mb-6 border-ai-primary/30 bg-gradient-to-r from-ai-primary/5 via-background to-ai-secondary/5">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ai-primary to-ai-secondary flex items-center justify-center shrink-0">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Supplier Sustainability Questionnaire</h3>
                <p className="text-sm text-muted-foreground">
                  Invite suppliers to complete the UKI sustainability assessment for enhanced compliance insights
                </p>
              </div>
            </div>
            <Button 
              className="ai-gradient border-0 shrink-0"
              onClick={() => window.open('https://suppllier-uki-questionnaire.manus.space/', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Questionnaire
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockSuppliers.map((supplier, index) => (
          <SupplierCard key={supplier.id} supplier={supplier} index={index} />
        ))}
      </div>
    </AppLayout>
  );
}
