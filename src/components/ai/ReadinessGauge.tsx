import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Clock, User } from 'lucide-react';
import { ReadinessScore, ReadinessGap } from '@/types/ai-context';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DPPEvidenceChecklist } from '@/components/compliance/DPPEvidenceChecklist';
import { LastUpdatedTimestamp } from '@/components/compliance/LastUpdatedTimestamp';

interface ReadinessGaugeProps {
  readiness: ReadinessScore;
  showGaps?: boolean;
}

export function ReadinessGauge({ readiness, showGaps = true }: ReadinessGaugeProps) {
  const TrendIcon = readiness.trend === 'improving' ? TrendingUp : 
                    readiness.trend === 'declining' ? TrendingDown : Minus;
  
  const trendColor = readiness.trend === 'improving' ? 'text-emerald-600' : 
                     readiness.trend === 'declining' ? 'text-red-500' : 'text-muted-foreground';

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-400';
    if (score >= 60) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Main Gauge */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Circular Progress */}
        <div className="relative w-16 h-16 md:w-24 md:h-24 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/20"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#readinessGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 251.2' }}
              animate={{ 
                strokeDasharray: `${(readiness.overall / 100) * 251.2} 251.2` 
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={cn(
                  readiness.overall >= 80 ? "stop-emerald-500" :
                  readiness.overall >= 60 ? "stop-amber-500" : "stop-red-500"
                )} stopColor="currentColor" />
                <stop offset="100%" className={cn(
                  readiness.overall >= 80 ? "stop-emerald-400" :
                  readiness.overall >= 60 ? "stop-amber-400" : "stop-red-400"
                )} stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-lg md:text-2xl font-bold", getScoreTextColor(readiness.overall))}>
              {readiness.overall}%
            </span>
            <div className={cn("flex items-center gap-0.5", trendColor)}>
              <TrendIcon className="w-2.5 md:w-3 h-2.5 md:h-3" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm md:text-base text-foreground mb-0.5 md:mb-1">DPP Readiness</h4>
          <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2 flex-wrap">
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] md:text-xs px-1.5 py-0",
                readiness.confidence === 'high' ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                readiness.confidence === 'medium' ? "bg-amber-100 text-amber-700 border-amber-200" :
                "bg-red-100 text-red-700 border-red-200"
              )}
            >
              {readiness.confidence}
            </Badge>
            <span className={cn("text-[10px] md:text-xs flex items-center gap-1", trendColor)}>
              <TrendIcon className="w-2.5 md:w-3 h-2.5 md:h-3" />
              {readiness.trend}
            </span>
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {readiness.gaps.filter(g => g.severity === 'critical').length} critical, {' '}
            {readiness.gaps.filter(g => g.severity === 'major').length} major
          </p>
        </div>
      </div>

      {/* FIX 4 [C-03]: DPP Evidence Checklist replaces bare percentage */}
      <DPPEvidenceChecklist />

      {/* FIX 9: Last updated timestamp */}
      <LastUpdatedTimestamp timestamp={readiness.lastUpdated} />

      {/* Gaps List */}
      {showGaps && readiness.gaps.length > 0 && (
        <div className="space-y-1.5 md:space-y-2">
          <h5 className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Active Gaps
          </h5>
          {readiness.gaps.map((gap, index) => (
            <GapItem key={index} gap={gap} />
          ))}
        </div>
      )}
    </div>
  );
}

function GapItem({ gap }: { gap: ReadinessGap }) {
  const severityStyles = {
    critical: 'border-l-red-500 bg-red-50/50',
    major: 'border-l-amber-500 bg-amber-50/50',
    minor: 'border-l-blue-500 bg-blue-50/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-2 md:p-3 rounded-lg border-l-4 border bg-card",
        severityStyles[gap.severity]
      )}
    >
      <div className="flex items-start justify-between gap-1.5 md:gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
            <AlertTriangle className={cn(
              "w-3 md:w-3.5 h-3 md:h-3.5 shrink-0",
              gap.severity === 'critical' ? "text-red-500" :
              gap.severity === 'major' ? "text-amber-500" : "text-blue-500"
            )} />
            <span className="text-xs md:text-sm font-medium text-foreground truncate">{gap.attribute}</span>
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2">{gap.reason}</p>
        </div>
        <Badge variant="outline" className={cn(
          "text-[10px] md:text-xs shrink-0 px-1.5 py-0",
          gap.severity === 'critical' ? "bg-red-100 text-red-700 border-red-200" :
          gap.severity === 'major' ? "bg-amber-100 text-amber-700 border-amber-200" :
          "bg-blue-100 text-blue-700 border-blue-200"
        )}>
          {gap.severity}
        </Badge>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4 mt-1.5 md:mt-2 pt-1.5 md:pt-2 border-t border-border/50">
        <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
          <Clock className="w-2.5 md:w-3 h-2.5 md:h-3" />
          <span>{gap.estimatedResolutionDays}d</span>
        </div>
        {gap.owner && (
          <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
            <User className="w-2.5 md:w-3 h-2.5 md:h-3" />
            <span className="truncate max-w-[60px] md:max-w-none">{gap.owner}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
