import { useState } from 'react';
import { screenRegistry } from '@/docs/registry';
import { ScreenRegistryEntry } from '@/docs/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Search, FileText, Users, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const roleColors: Record<string, string> = {
  buyer: 'bg-blue-100 text-blue-700',
  supplier: 'bg-amber-100 text-amber-700',
  lab_technician: 'bg-purple-100 text-purple-700',
  manager: 'bg-emerald-100 text-emerald-700',
  admin: 'bg-red-100 text-red-700',
};

export function AppMapTab() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [expandedScreen, setExpandedScreen] = useState<string | null>(null);

  const filteredScreens = screenRegistry.filter(screen => {
    const matchesSearch = screen.name.toLowerCase().includes(search.toLowerCase()) ||
      screen.route.toLowerCase().includes(search.toLowerCase()) ||
      screen.description.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || screen.primaryPersona === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Screen Inventory</h3>
          <p className="text-sm text-muted-foreground">
            {screenRegistry.length} screens documented
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search screens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="lab_technician">Lab Technician</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Screen List */}
      <div className="space-y-3">
        {filteredScreens.map((screen) => (
          <ScreenCard
            key={screen.id}
            screen={screen}
            isExpanded={expandedScreen === screen.id}
            onToggle={() => setExpandedScreen(expandedScreen === screen.id ? null : screen.id)}
          />
        ))}
      </div>

      {filteredScreens.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No screens match your search criteria.
        </div>
      )}
    </div>
  );
}

interface ScreenCardProps {
  screen: ScreenRegistryEntry;
  isExpanded: boolean;
  onToggle: () => void;
}

function ScreenCard({ screen, isExpanded, onToggle }: ScreenCardProps) {
  return (
    <Card className={cn("transition-all", isExpanded && "ring-2 ring-primary/20")}>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="text-left">
                  <CardTitle className="text-base flex items-center gap-2">
                    {screen.name}
                    <code className="text-xs font-normal bg-muted px-1.5 py-0.5 rounded">
                      {screen.route}
                    </code>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{screen.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className={cn("text-xs", roleColors[screen.primaryPersona])}>
                  {screen.primaryPersona}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            {/* Jobs To Be Done */}
            <div>
              <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                Jobs To Be Done
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {screen.jobsToBeDone.map((job, i) => (
                  <li key={i}>{job}</li>
                ))}
              </ul>
            </div>

            {/* UI Sections */}
            {screen.uiSections.length > 0 && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Layers className="h-4 w-4" />
                  UI Sections
                </h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Section</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {screen.uiSections.map((section) => (
                        <TableRow key={section.id}>
                          <TableCell className="font-medium">{section.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{section.type}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {section.description}
                            {section.isConditional && (
                              <span className="text-amber-600 text-xs ml-1">
                                ({section.conditionDescription})
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Actions */}
            {screen.actions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Actions</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Trigger</TableHead>
                        <TableHead>Side Effects</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {screen.actions.map((action) => (
                        <TableRow key={action.id}>
                          <TableCell className="font-medium">
                            {action.label}
                            {action.roleRestricted && (
                              <span className="text-xs text-muted-foreground ml-2">
                                ({action.roleRestricted.join(', ')})
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">{action.trigger}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {action.sideEffects.join('; ')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Data Entities */}
            {screen.dataEntitiesUsed.length > 0 && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  Data Entities Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {screen.dataEntitiesUsed.map((entity) => (
                    <Badge key={entity.entityId} variant="outline">
                      {entity.entityName}
                      <span className="text-muted-foreground ml-1">({entity.operation})</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Source File */}
            <div className="pt-2 border-t">
              <code className="text-xs text-muted-foreground">{screen.sourceFile}</code>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
