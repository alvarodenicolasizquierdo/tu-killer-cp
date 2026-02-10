import { useState } from 'react';
import { exportAsJSON, exportAsMarkdown, copyMarkdownToClipboard, generateDocumentationExport } from '@/docs/exporters';
import { tagEvent } from '@/utils/clarityTracking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileJson, FileText, Copy, Check, FileArchive, Database, GitBranch, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function ExportTab() {
  const [isExportingJSON, setIsExportingJSON] = useState(false);
  const [isExportingMD, setIsExportingMD] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const exportData = generateDocumentationExport();

  const handleExportJSON = async () => {
    setIsExportingJSON(true);
    tagEvent('export', 'json');
    try {
      exportAsJSON();
      toast({
        title: "Export Complete",
        description: "carlos_docs_pack.json has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export JSON file.",
        variant: "destructive",
      });
    } finally {
      setIsExportingJSON(false);
    }
  };

  const handleExportMarkdown = async () => {
    setIsExportingMD(true);
    tagEvent('export', 'markdown');
    try {
      exportAsMarkdown();
      toast({
        title: "Export Complete",
        description: "carlos_docs_pack.md has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export Markdown file.",
        variant: "destructive",
      });
    } finally {
      setIsExportingMD(false);
    }
  };

  const handleCopyMarkdown = async () => {
    const success = await copyMarkdownToClipboard();
    if (success) {
      setIsCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "Markdown documentation copied. Paste into Notion or Confluence.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Export Documentation Pack</h3>
        <p className="text-sm text-muted-foreground">
          Download the complete documentation for use in training AI agents or generating PRDs.
        </p>
      </div>

      {/* Export Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileArchive className="h-5 w-5" />
            Export Contents
          </CardTitle>
          <CardDescription>
            The documentation pack includes all screens, workflows, data models, and role definitions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Database className="h-6 w-6 text-primary" />
              <div>
                <div className="text-xl font-bold">{exportData.meta.totalScreens}</div>
                <div className="text-xs text-muted-foreground">Screens</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <GitBranch className="h-6 w-6 text-primary" />
              <div>
                <div className="text-xl font-bold">{exportData.meta.totalWorkflows}</div>
                <div className="text-xs text-muted-foreground">Workflows</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Database className="h-6 w-6 text-primary" />
              <div>
                <div className="text-xl font-bold">{exportData.meta.totalEntities}</div>
                <div className="text-xs text-muted-foreground">Entities</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Users className="h-6 w-6 text-primary" />
              <div>
                <div className="text-xl font-bold">{exportData.roles.definitions.length}</div>
                <div className="text-xs text-muted-foreground">Roles</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* JSON Export */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileJson className="h-5 w-5 text-amber-600" />
              JSON Export
            </CardTitle>
            <CardDescription>
              Structured data format ideal for programmatic use, AI agent training, and integration with other tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Programmatic Use</Badge>
              <Badge variant="secondary">AI Training</Badge>
              <Badge variant="secondary">API Integration</Badge>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <code className="text-xs text-muted-foreground">carlos_docs_pack.json</code>
            </div>
            <Button 
              onClick={handleExportJSON} 
              disabled={isExportingJSON}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExportingJSON ? 'Exporting...' : 'Export JSON'}
            </Button>
          </CardContent>
        </Card>

        {/* Markdown Export */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Markdown Export
            </CardTitle>
            <CardDescription>
              Human-readable format perfect for pasting into Notion, Confluence, or other documentation platforms.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Notion</Badge>
              <Badge variant="secondary">Confluence</Badge>
              <Badge variant="secondary">GitHub</Badge>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <code className="text-xs text-muted-foreground">carlos_docs_pack.md</code>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleExportMarkdown} 
                disabled={isExportingMD}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExportingMD ? 'Exporting...' : 'Download'}
              </Button>
              <Button 
                variant="outline"
                onClick={handleCopyMarkdown}
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Notes */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Usage Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">For AI Agent Training</h4>
              <p className="text-sm text-muted-foreground">
                Use the JSON export to feed into AI systems. The structured format includes all screen 
                definitions, workflows with decision trees, and data model relationships that can help 
                an AI understand the application's behavior.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">For PRD Generation</h4>
              <p className="text-sm text-muted-foreground">
                Use the Markdown export as a foundation for Product Requirements Documents. The format 
                is already structured with proper headings, tables, and lists that can be directly 
                imported into documentation platforms.
              </p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Keeping Documentation Updated</h4>
            <p className="text-sm text-muted-foreground">
              The documentation is generated from the registry at <code className="text-xs bg-background px-1 rounded">src/docs/registry.ts</code>. 
              When adding new screens or modifying workflows, update the registry file to keep 
              documentation in sync. Items marked with <Badge variant="secondary" className="text-xs mx-1">TODO</Badge> need 
              verification from the source files.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export Metadata */}
      <div className="text-xs text-muted-foreground text-center">
        Version {exportData.meta.version} • Generated {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}
