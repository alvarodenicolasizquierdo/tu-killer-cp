import { Brain, Shield, Sparkles, LayoutDashboard, FlaskConical, HelpCircle, Sliders, Rocket, Target } from 'lucide-react';
import { createElement } from 'react';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  selector?: string; // CSS selector for element to highlight
  position: 'center' | 'bottom' | 'top' | 'left' | 'right';
}

export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to CARLOS',
    description: 'Your AI-powered TIC command center. This quick tour will show you what makes CARLOS different from traditional portals.',
    icon: createElement(Rocket, { className: 'h-8 w-8' }),
    position: 'center'
  },
  {
    id: 'ai-dashboard',
    title: 'AI-First Dashboard',
    description: 'Unlike static dashboards, CARLOS dynamically assembles your view based on your role, current risks, and priorities. The UI adapts to your operational reality.',
    icon: createElement(LayoutDashboard, { className: 'h-8 w-8' }),
    selector: '[data-tour="ai-context"]',
    position: 'right'
  },
  {
    id: 'tasks',
    title: 'AI-Prioritized Tasks',
    description: 'Tasks are ranked by impact if ignored—not just due date. Each card shows the consequence of inaction and AI confidence in the recommendation.',
    icon: createElement(Target, { className: 'h-8 w-8' }),
    selector: '[data-tour="tasks-widget"]',
    position: 'right'
  },
  {
    id: 'reasoning',
    title: 'Transparent AI Reasoning',
    description: 'Every AI suggestion follows our explanation framework: Problem → Evidence → Consequence → Fix. No black boxes—you always understand why.',
    icon: createElement(Brain, { className: 'h-8 w-8' }),
    selector: '[data-tour="readiness-gauge"]',
    position: 'left'
  },
  {
    id: 'dpp',
    title: 'DPP-Native Design',
    description: 'Product structures map directly to Digital Product Passport requirements. Components become material provenance, test results become verification evidence.',
    icon: createElement(Shield, { className: 'h-8 w-8' }),
    position: 'center'
  },
  {
    id: 'scenario',
    title: 'Scenario Simulator',
    description: 'Run "what-if" scenarios like "DPP Enforced Tomorrow" to see real-time impact on your readiness scores and task priorities.',
    icon: createElement(FlaskConical, { className: 'h-8 w-8' }),
    selector: '[data-tour="scenario-simulator"]',
    position: 'top'
  },
  {
    id: 'governance',
    title: 'Smart Governance',
    description: 'Self-approval entitlements (Bronze/Silver/Gold) control who can approve what. AI guards explain restrictions and route to appropriate approvers.',
    icon: createElement(Sliders, { className: 'h-8 w-8' }),
    position: 'center'
  },
  {
    id: 'help',
    title: 'Contextual Help System',
    description: 'Press Ctrl+/ anywhere to access AI-powered help. Get instant answers from SOPs, past emails, and webinar transcripts—all with confidence scores.',
    icon: createElement(HelpCircle, { className: 'h-8 w-8' }),
    position: 'center'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Start exploring your personalized command center. Remember: CARLOS learns from your patterns to surface what matters most.',
    icon: createElement(Sparkles, { className: 'h-8 w-8' }),
    position: 'center'
  }
];

export const TOUR_STORAGE_KEY = 'carlos-tour-completed';
