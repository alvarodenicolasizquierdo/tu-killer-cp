import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { tagScreen } from '@/utils/clarityTracking';
import { useUser } from '@/contexts/UserContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppMapTab, RolesTab, WorkflowsTab, DataModelTab, ExportTab } from '@/components/documentation';
import { Map, Users, GitBranch, Database, Download } from 'lucide-react';

export default function Documentation() {
  const { currentUser } = useUser();

  useEffect(() => { tagScreen('portal-documentation'); }, []);

  // Admin-only access
  if (currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Documentation</h1>
          <p className="text-muted-foreground">
            As-Built documentation for the CARLOS platform. Admin access only.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="app-map" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="app-map" className="gap-2">
              <Map className="h-4 w-4 hidden sm:block" />
              App Map
            </TabsTrigger>
            <TabsTrigger value="roles" className="gap-2">
              <Users className="h-4 w-4 hidden sm:block" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="workflows" className="gap-2">
              <GitBranch className="h-4 w-4 hidden sm:block" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="data-model" className="gap-2">
              <Database className="h-4 w-4 hidden sm:block" />
              Data Model
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <Download className="h-4 w-4 hidden sm:block" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="app-map">
            <AppMapTab />
          </TabsContent>

          <TabsContent value="roles">
            <RolesTab />
          </TabsContent>

          <TabsContent value="workflows">
            <WorkflowsTab />
          </TabsContent>

          <TabsContent value="data-model">
            <DataModelTab />
          </TabsContent>

          <TabsContent value="export">
            <ExportTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
