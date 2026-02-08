import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { AIContext, AIComputedTask, ReadinessScore, ScenarioState, ScenarioImpact, LayoutConfig } from '@/types/ai-context';
import { mockTRFs, mockSuppliers, mockTasks } from '@/data/mockData';

// Simulates AI context resolution that happens before UI renders
export function useAIContext() {
  const { currentUser } = useUser();
  const [isComputing, setIsComputing] = useState(true);
  const [scenarioState, setScenarioState] = useState<ScenarioState>({
    dppEnforced: false,
    regulationThreshold: 0,
  });

  // Simulate AI computing the context
  const context = useMemo<AIContext>(() => {
    const criticalTRFs = mockTRFs.filter(t => t.priority === 'critical' || (t.slaRemaining && t.slaRemaining <= 24));
    const atRiskSuppliers = mockSuppliers.filter(s => s.status === 'at-risk');
    
    return {
      userId: currentUser.id,
      role: currentUser.role,
      criticalItems: criticalTRFs.length + atRiskSuppliers.length,
      upcomingRegulatoryRisk: criticalTRFs.length >= 2 ? 'high' : 'medium',
      blockedDownstream: criticalTRFs.some(t => t.status === 'pending_review'),
      confidenceGap: 'medium',
      historicalDelayPattern: ['document_upload', 'approval_delay'],
      computedAt: new Date().toISOString(),
    };
  }, [currentUser]);

  // AI-computed task list with full reasoning
  const computedTasks = useMemo<AIComputedTask[]>(() => {
    return mockTasks.map((task, index) => {
      const impactScore = task.priority === 'critical' ? 95 : task.priority === 'at-risk' ? 70 : 40;
      const urgencyScore = task.slaRemaining ? Math.max(0, 100 - task.slaRemaining * 2) : 50;
      
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        impactScore,
        urgencyScore,
        riskScore: impactScore * 0.7 + urgencyScore * 0.3,
        dependencyChain: task.priority === 'critical' ? ['downstream-shipment', 'retail-launch'] : [],
        slaHoursRemaining: task.slaRemaining,
        objectType: task.objectType as any,
        objectId: task.objectId,
        reasoning: {
          whyProblem: getWhyProblem(task),
          evidence: getEvidence(task),
          consequenceIfIgnored: getConsequence(task),
          fastestFix: getFastestFix(task),
        },
        recommendedAction: {
          label: getRecommendedAction(task),
          type: (task.type === 'approval' ? 'approve' : 'review') as 'approve' | 'review' | 'escalate' | 'request_info' | 'schedule',
          confidence: task.aiConfidence || 85,
        },
      };
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, []);

  // Readiness score with confidence bands
  const readiness = useMemo<ReadinessScore>(() => {
    const baseReadiness = scenarioState.dppEnforced ? 58 : 74;
    const thresholdImpact = scenarioState.regulationThreshold * 0.3;
    
    return {
      overall: Math.max(0, baseReadiness - thresholdImpact),
      trend: scenarioState.dppEnforced ? 'declining' : 'stable',
      confidence: 'medium',
      gaps: [
        {
          attribute: 'Recycled content verification',
          severity: 'critical',
          reason: 'Missing third-party certification for 3 suppliers',
          estimatedResolutionDays: 14,
          owner: 'Supplier Relations',
        },
        {
          attribute: 'Chemical compliance documentation',
          severity: 'major',
          reason: 'REACH certificates expiring within 30 days for 2 products',
          estimatedResolutionDays: 7,
          owner: 'Compliance Team',
        },
        ...(scenarioState.dppEnforced ? [{
          attribute: 'Digital Product Passport data',
          severity: 'critical' as const,
          reason: 'DPP schema not yet implemented across product catalog',
          estimatedResolutionDays: 45,
          owner: 'Digital Transformation',
        }] : []),
      ],
      lastUpdated: new Date().toISOString(),
    };
  }, [scenarioState]);

  // Scenario impact calculation
  const scenarioImpact = useMemo<ScenarioImpact>(() => {
    if (!scenarioState.dppEnforced && scenarioState.regulationThreshold === 0) {
      return { readinessChange: 0, newCriticalTasks: 0, affectedProducts: 0, estimatedRemediationDays: 0 };
    }
    
    return {
      readinessChange: scenarioState.dppEnforced ? -16 : -Math.floor(scenarioState.regulationThreshold * 0.3),
      newCriticalTasks: scenarioState.dppEnforced ? 8 : Math.floor(scenarioState.regulationThreshold / 10),
      affectedProducts: scenarioState.dppEnforced ? 156 : Math.floor(scenarioState.regulationThreshold * 1.5),
      estimatedRemediationDays: scenarioState.dppEnforced ? 45 : Math.floor(scenarioState.regulationThreshold / 5),
    };
  }, [scenarioState]);

  // Layout configuration based on role and context
  const layoutConfig = useMemo<LayoutConfig>(() => {
    switch (currentUser.role) {
      case 'lab_technician':
        return {
          primaryWidget: 'lab_queue',
          secondaryWidgets: ['tasks', 'readiness'],
          emphasisAreas: ['lab', 'quality'],
        };
      case 'manager':
        return {
          primaryWidget: 'confidence_dashboard',
          secondaryWidgets: ['regulatory_horizon', 'tasks'],
          emphasisAreas: ['regulatory', 'suppliers'],
        };
      default:
        return {
          primaryWidget: 'tasks',
          secondaryWidgets: ['readiness', 'regulatory_horizon'],
          emphasisAreas: ['quality', 'regulatory'],
        };
    }
  }, [currentUser.role]);

  useEffect(() => {
    // Simulate AI computation time
    const timer = setTimeout(() => setIsComputing(false), 300);
    return () => clearTimeout(timer);
  }, [currentUser]);

  return {
    context,
    computedTasks,
    readiness,
    scenarioState,
    setScenarioState,
    scenarioImpact,
    layoutConfig,
    isComputing,
  };
}

// Helper functions for AI reasoning generation
function getWhyProblem(task: any): string {
  if (task.priority === 'critical' && task.slaRemaining) {
    return `SLA breach imminent in ${task.slaRemaining} hours. This blocks downstream shipment scheduling and retail launch timeline.`;
  }
  if (task.type === 'approval') {
    return 'Pending approval is blocking lab capacity allocation and supplier payment processing.';
  }
  return 'Action required to maintain compliance status and prevent escalation to critical priority.';
}

function getEvidence(task: any): string[] {
  const evidence = ['Task created based on workflow trigger'];
  if (task.slaRemaining) evidence.push(`SLA timer: ${task.slaRemaining}h remaining`);
  if (task.aiConfidence) evidence.push(`AI confidence: ${task.aiConfidence}% based on historical patterns`);
  if (task.priority === 'critical') evidence.push('Priority elevated due to dependency chain impact');
  return evidence;
}

function getConsequence(task: any): string {
  if (task.priority === 'critical') {
    return 'Retail launch delay of 2-4 weeks. Potential contract penalties and lost revenue of ~$50K per week.';
  }
  if (task.priority === 'at-risk') {
    return 'Risk escalation to critical within 48 hours. Additional remediation costs estimated at $5-10K.';
  }
  return 'Operational inefficiency and potential compliance audit findings.';
}

// FIX 2 [C-02]: Reframe as prioritisation, not approval recommendation
function getFastestFix(task: any): string {
  if (task.type === 'approval') {
    return 'Review test results (est. 15 min) and assess against tolerance bands for compliance decision.';
  }
  if (task.type === 'upload') {
    return 'Request document from supplier via automated workflow (response expected within 24h).';
  }
  return 'Assign to appropriate team member and set priority escalation trigger.';
}

function getRecommendedAction(task: any): string {
  if (task.type === 'approval') return 'Review Details';
  if (task.type === 'review') return 'Open Details';
  if (task.type === 'upload') return 'Request Document';
  return 'Take Action';
}
