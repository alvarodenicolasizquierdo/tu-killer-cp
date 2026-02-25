/**
 * Insight - Main insights page with 7 tabs
 * Replaces Analytics with richer reporting capabilities
 */

import { useState, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download, AlertTriangle, Shield, GitBranch, LayoutGrid, Receipt, Wallet, FileText } from 'lucide-react';
import { RiskSummaryDashboard } from '@/components/reports/RiskSummaryDashboard';
import { ComplianceHealthView } from '@/components/reports/ComplianceHealthView';
import { PipelineFlowDashboard } from '@/components/reports/PipelineFlowDashboard';
import { ReportOverview } from '@/components/reports/ReportOverview';
import { TransactionTable } from '@/components/reports/TransactionTable';
import { BalancesView } from '@/components/reports/BalancesView';
import { CustomReports } from '@/components/reports/CustomReports';
import { transactions } from '@/data/mockReports';

export default function Insight() {
  const [activeTab, setActiveTab] = useState('risk');
  useEffect(() => { tagScreen('portal-analytics'); }, []);

  return (
    <AppLayout 
      title="Insight" 
      subtitle="Decision-oriented insights on risk, compliance, and pipeline health"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 bg-transparent p-0 mb-6">
            <TabsTrigger 
              value="risk" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Risk Summary
            </TabsTrigger>
            <TabsTrigger 
              value="compliance"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <Shield className="w-4 h-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger 
              value="pipeline"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <GitBranch className="w-4 h-4" />
              Pipeline Flow
            </TabsTrigger>
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="transactions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <Receipt className="w-4 h-4" />
              Transactions
              <Badge variant="secondary" className="ml-1 text-xs">{transactions.length}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="balances"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <Wallet className="w-4 h-4" />
              Balances
            </TabsTrigger>
            <TabsTrigger 
              value="custom"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <FileText className="w-4 h-4" />
              Custom Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="risk" className="mt-0">
            <RiskSummaryDashboard />
          </TabsContent>

          <TabsContent value="compliance" className="mt-0">
            <ComplianceHealthView />
          </TabsContent>

          <TabsContent value="pipeline" className="mt-0">
            <PipelineFlowDashboard />
          </TabsContent>

          <TabsContent value="overview" className="mt-0">
            <ReportOverview />
          </TabsContent>

          <TabsContent value="transactions" className="mt-0">
            <TransactionTable />
          </TabsContent>

          <TabsContent value="balances" className="mt-0">
            <BalancesView />
          </TabsContent>

          <TabsContent value="custom" className="mt-0">
            <CustomReports />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
