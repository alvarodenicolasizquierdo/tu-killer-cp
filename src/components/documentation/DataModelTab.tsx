import { useState } from 'react';
import { entityRegistry, enumRegistry, relationshipRegistry } from '@/docs/registry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Search, Database, List, GitBranch, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DataModelTab() {
  const [search, setSearch] = useState('');
  const [expandedEntity, setExpandedEntity] = useState<string | null>(null);

  const filteredEntities = entityRegistry.filter(entity =>
    entity.name.toLowerCase().includes(search.toLowerCase()) ||
    entity.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{entityRegistry.length}</div>
                <div className="text-sm text-muted-foreground">Entities</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <List className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{enumRegistry.length}</div>
                <div className="text-sm text-muted-foreground">Enums</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <GitBranch className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{relationshipRegistry.length}</div>
                <div className="text-sm text-muted-foreground">Relationships</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="entities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="enums">Enums</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
        </TabsList>

        {/* Entities Tab */}
        <TabsContent value="entities" className="space-y-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-3">
            {filteredEntities.map((entity) => (
              <Card key={entity.id} className={cn("transition-all", expandedEntity === entity.id && "ring-2 ring-primary/20")}>
                <Collapsible
                  open={expandedEntity === entity.id}
                  onOpenChange={() => setExpandedEntity(expandedEntity === entity.id ? null : entity.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {expandedEntity === entity.id ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="text-left">
                            <CardTitle className="text-base flex items-center gap-2">
                              {entity.name}
                              {entity.dppRelevance && (
                                <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                                  DPP
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1">{entity.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {entity.fields.length} fields
                        </Badge>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      {/* DPP Relevance */}
                      {entity.dppRelevance && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <div className="text-sm font-medium text-emerald-800 mb-1">DPP Relevance</div>
                          <p className="text-sm text-emerald-700">{entity.dppRelevance}</p>
                        </div>
                      )}

                      {/* Fields Table */}
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Field</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Required</TableHead>
                              <TableHead>Description</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {entity.fields.map((field) => (
                              <TableRow key={field.name}>
                                <TableCell>
                                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{field.name}</code>
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                  {field.type}
                                  {field.enumRef && (
                                    <span className="text-muted-foreground ml-1">
                                      (→{field.enumRef})
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={field.required ? "default" : "secondary"} className="text-xs">
                                    {field.required ? 'Yes' : 'No'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {field.description}
                                  {field.isUnknown && (
                                    <span className="text-amber-600 ml-1">
                                      [TODO: {field.unknownLocation}]
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Source File */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <FileCode className="h-4 w-4 text-muted-foreground" />
                        <code className="text-xs text-muted-foreground">{entity.sourceFile}</code>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Enums Tab */}
        <TabsContent value="enums" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {enumRegistry.map((enumDef) => (
              <Card key={enumDef.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{enumDef.name}</CardTitle>
                  <CardDescription>
                    <code className="text-xs">{enumDef.sourceFile}</code>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Value</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enumDef.values.map((val) => (
                          <TableRow key={val.value}>
                            <TableCell>
                              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{val.value}</code>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{val.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Relationships Tab */}
        <TabsContent value="relationships" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relationshipRegistry.map((rel) => (
                      <TableRow key={rel.id}>
                        <TableCell className="font-medium">{rel.from}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-mono">
                            {rel.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{rel.to}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{rel.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Visual Guide */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3">Relationship Types</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">1:1</Badge>
                  <span className="text-muted-foreground">One-to-One</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">1:many</Badge>
                  <span className="text-muted-foreground">One-to-Many</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">many:many</Badge>
                  <span className="text-muted-foreground">Many-to-Many</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
