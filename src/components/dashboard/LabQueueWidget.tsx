import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FlaskConical, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { mockLabSamples } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function LabQueueWidget() {
  const samples = mockLabSamples.filter(s => s.status === 'testing' || s.status === 'queued');
  const criticalCount = samples.filter(s => s.priority === 'critical').length;
  
  return (
    <Card className="border-2 border-ai-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Your Lab Queue</CardTitle>
              <p className="text-xs text-muted-foreground">
                {samples.length} samples requiring attention
              </p>
            </div>
          </div>
          {criticalCount > 0 && (
            <Badge variant="destructive" className="gap-1.5">
              <AlertTriangle className="w-3 h-3" />
              {criticalCount} Critical
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {samples.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FlaskConical className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No samples in queue</p>
          </div>
        ) : (
          samples.map((sample) => (
            <div
              key={sample.id}
              className={cn(
                "p-3 rounded-lg border transition-colors hover:bg-muted/50",
                sample.priority === 'critical' && "border-red-200 bg-red-50/50",
                sample.priority === 'at-risk' && "border-amber-200 bg-amber-50/30"
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{sample.trfReference}</p>
                  <p className="text-xs text-muted-foreground">{sample.sampleType} • {sample.testType}</p>
                </div>
                <Badge 
                  variant={sample.priority === 'critical' ? 'destructive' : sample.priority === 'at-risk' ? 'outline' : 'secondary'}
                  className={cn(
                    sample.priority === 'at-risk' && "bg-amber-100 text-amber-700 border-amber-200"
                  )}
                >
                  {sample.priority}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={sample.progress} className="flex-1 h-1.5" />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Due {sample.dueDate}
                </span>
              </div>
            </div>
          ))
        )}
        
        <Button variant="outline" className="w-full mt-2" asChild>
          <Link to="/lab">
            View Full Lab Queue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
