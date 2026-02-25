import { useState, useEffect } from 'react';
import { tagScreen } from '@/utils/clarityTracking';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Download, FileJson, Star, CheckCircle2, Clock, AlertTriangle, Sparkles, Trophy, Monitor } from 'lucide-react';
import { canonicalFeatureSpec, getSpecSummary } from '@/data/canonicalFeatureSpec';

export default function FeatureSpec() {
  const summary = getSpecSummary();
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { tagScreen('portal-feature-spec'); }, []);

  const handleDownload = () => {
    setDownloading(true);
    const blob = new Blob([JSON.stringify(canonicalFeatureSpec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tht-carlos_canonical_feature_spec.json';
    link.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(false), 1000);
  };

  const maturityPercent = Math.round((summary.implementedFeatures / summary.totalFeatures) * 100);
  const partialPercent = Math.round((summary.partialFeatures / summary.totalFeatures) * 100);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Canonical Feature Specification</h1>
            <p className="text-muted-foreground mt-1">
              Exhaustive extraction of every feature, capability, and UI element in CARLOS
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Extracted: {new Date().toLocaleDateString()} · Method: Automated codebase introspection
            </p>
          </div>
          <Button size="lg" className="gap-2" onClick={handleDownload} disabled={downloading}>
            {downloading ? <Clock className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
            {downloading ? 'Downloading...' : 'Download JSON'}
            <FileJson className="w-4 h-4" />
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Modules', value: summary.totalModules, icon: Monitor },
            { label: 'Features', value: summary.totalFeatures, icon: Sparkles },
            { label: 'Screens', value: summary.totalScreens, icon: Monitor },
            { label: 'Components', value: summary.totalComponents, icon: CheckCircle2 },
            { label: 'Routes', value: summary.totalRoutes, icon: CheckCircle2 },
            { label: 'AI Capabilities', value: summary.aiCapabilities, icon: Sparkles },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="pt-4 pb-3 px-4 text-center">
                <Icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Maturity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Implementation Maturity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Implemented ({summary.implementedFeatures})</span>
                  <span className="font-medium">{maturityPercent}%</span>
                </div>
                <Progress value={maturityPercent} className="h-3" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center text-sm">
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                <p className="text-xl font-bold text-emerald-600">{summary.implementedFeatures}</p>
                <p className="text-muted-foreground">Complete</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                <p className="text-xl font-bold text-amber-600">{summary.partialFeatures}</p>
                <p className="text-muted-foreground">Partial</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/30">
                <p className="text-xl font-bold text-slate-600">{summary.stubbedFeatures}</p>
                <p className="text-muted-foreground">Stubbed</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <p className="text-xl font-bold text-blue-600">{summary.plannedFeatures}</p>
                <p className="text-muted-foreground">Planned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Module Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.moduleBreakdown.map((mod) => (
                <div key={mod.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{mod.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {mod.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {mod.featureCount} features · {mod.maturity} · {mod.demoReadiness.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium">{mod.wowFactor}/10</span>
                    </div>
                    <Badge
                      variant={mod.demoReadiness === 'demo_ready' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {mod.demoReadiness === 'demo_ready' ? '✓ Demo Ready' : 'Needs Polish'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 10 Wow Moments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Top 10 Demo Wow Moments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.topWowMoments.map((wow) => (
                <div key={wow.rank} className="flex gap-4 p-4 rounded-lg border bg-card">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{wow.rank}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold">{wow.feature}</p>
                    <p className="text-sm text-muted-foreground">{wow.what_to_show}</p>
                    <div className="mt-2 p-2 rounded bg-muted/50">
                      <p className="text-xs font-medium text-primary">Talk Track:</p>
                      <p className="text-xs text-muted-foreground italic">"{wow.talk_track}"</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{wow.route}</Badge>
                      <Badge variant="secondary" className="text-xs">{wow.vs_inspectorio.substring(0, 60)}…</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-3xl font-bold text-primary">{summary.demoReadyModules}/{summary.totalModules}</p>
              <p className="text-sm text-muted-foreground">Modules Demo Ready</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-3xl font-bold text-amber-500">{summary.avgWowFactor}</p>
              <p className="text-sm text-muted-foreground">Avg Wow Factor</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">{maturityPercent}%</p>
              <p className="text-sm text-muted-foreground">Features Implemented</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center pb-8">
          <Button size="lg" className="gap-2" onClick={handleDownload}>
            <Download className="w-5 h-5" />
            Download tht-carlos_canonical_feature_spec.json
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
