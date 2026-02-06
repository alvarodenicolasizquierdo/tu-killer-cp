import { rolesRegistry, approvalMatrix, featureFlags } from '@/docs/registry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Shield, User, Settings, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

const roleIcons: Record<string, string> = {
  buyer: '🛒',
  supplier: '🏭',
  lab_technician: '🔬',
  manager: '📊',
  admin: '⚙️',
};

const roleColors: Record<string, string> = {
  buyer: 'border-blue-200 bg-blue-50',
  supplier: 'border-amber-200 bg-amber-50',
  lab_technician: 'border-purple-200 bg-purple-50',
  manager: 'border-emerald-200 bg-emerald-50',
  admin: 'border-red-200 bg-red-50',
};

export function RolesTab() {
  return (
    <div className="space-y-8">
      {/* Role Definitions */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Role Definitions</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          The platform supports 5 distinct user roles, each with specific responsibilities and access levels.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rolesRegistry.map((role) => (
            <Card key={role.role} className={cn("border-2", roleColors[role.role])}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-xl">{roleIcons[role.role]}</span>
                  {role.displayName}
                </CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Primary Responsibilities</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {role.primaryResponsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t">
                  <Badge variant="secondary" className="text-xs">
                    {role.accessibleScreens.length} screens accessible
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Approval Matrix */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Self-Approval Entitlements</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Users can be assigned one of four approval levels that determine what they can self-approve without routing.
        </p>

        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Level</TableHead>
                    <TableHead>Care Labels</TableHead>
                    <TableHead>Base Testing</TableHead>
                    <TableHead>Bulk Testing</TableHead>
                    <TableHead>Garment Testing</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalMatrix.map((level) => (
                    <TableRow key={level.level}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{level.level}</span>
                          <span className="text-xs text-muted-foreground">{level.displayName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <PermissionIcon allowed={level.permissions.careLabels} />
                      </TableCell>
                      <TableCell>
                        <PermissionIcon allowed={level.permissions.baseTesting} />
                      </TableCell>
                      <TableCell>
                        <PermissionIcon allowed={level.permissions.bulkTesting} />
                      </TableCell>
                      <TableCell>
                        <PermissionIcon allowed={level.permissions.garmentTesting} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 space-y-3">
              {approvalMatrix.map((level) => (
                <div key={level.level} className="flex gap-3 items-start">
                  <Badge variant="outline" className="shrink-0 w-16 justify-center">
                    {level.level}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Feature Flags */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Flag className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Feature Flags</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Platform features that can be toggled on or off for testing or gradual rollout.
        </p>

        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-40">Flag ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Affected Screens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featureFlags.map((flag) => (
                    <TableRow key={flag.id}>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{flag.id}</code>
                      </TableCell>
                      <TableCell className="font-medium">{flag.name}</TableCell>
                      <TableCell>
                        <Badge variant={flag.defaultValue ? "default" : "secondary"}>
                          {flag.defaultValue ? 'ON' : 'OFF'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{flag.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {flag.affectedScreens.map((screen) => (
                            <Badge key={screen} variant="outline" className="text-xs">
                              {screen}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Demo Mode Note */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex gap-3 items-start">
            <Settings className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Demo Mode Active</h4>
              <p className="text-sm text-muted-foreground">
                The platform is currently in demo mode, which enables user switching in the sidebar. 
                This allows stakeholders to experience the platform from different role perspectives 
                without needing separate accounts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PermissionIcon({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <div className="flex items-center gap-1 text-emerald-600">
      <Check className="h-4 w-4" />
      <span className="text-xs">Yes</span>
    </div>
  ) : (
    <div className="flex items-center gap-1 text-red-500">
      <X className="h-4 w-4" />
      <span className="text-xs">No</span>
    </div>
  );
}
