import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Brain, 
  Shield, 
  Sparkles, 
  LayoutDashboard,
  FlaskConical,
  HelpCircle,
  Sliders,
  X,
  ChevronLeft,
  ChevronRight,
  Rocket
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string; // CSS selector or area name
  position: 'center' | 'bottom-right' | 'bottom-left' | 'top-right';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to CARLOS',
    description: 'Your AI-powered TIC command center. This quick tour will show you what makes CARLOS different from traditional portals.',
    icon: <Rocket className="h-8 w-8" />,
    position: 'center'
  },
  {
    id: 'ai-dashboard',
    title: 'AI-First Dashboard',
    description: 'Unlike static dashboards, CARLOS dynamically assembles your view based on your role, current risks, and priorities. The UI adapts to your operational reality.',
    icon: <LayoutDashboard className="h-8 w-8" />,
    position: 'center'
  },
  {
    id: 'reasoning',
    title: 'Transparent AI Reasoning',
    description: 'Every AI suggestion follows our explanation framework: Problem → Evidence → Consequence → Fix. No black boxes—you always understand why.',
    icon: <Brain className="h-8 w-8" />,
    position: 'center'
  },
  {
    id: 'dpp',
    title: 'DPP-Native Design',
    description: 'Product structures map directly to Digital Product Passport requirements. Components become material provenance, test results become verification evidence.',
    icon: <Shield className="h-8 w-8" />,
    position: 'center'
  },
  {
    id: 'scenario',
    title: 'Scenario Simulator',
    description: 'Run "what-if" scenarios like "DPP Enforced Tomorrow" to see real-time impact on your readiness scores and task priorities.',
    icon: <FlaskConical className="h-8 w-8" />,
    position: 'center'
  },
  {
    id: 'governance',
    title: 'Smart Governance',
    description: 'Self-approval entitlements (Bronze/Silver/Gold) control who can approve what. AI guards explain restrictions and route to appropriate approvers.',
    icon: <Sliders className="h-8 w-8" />,
    position: 'center'
  },
  {
    id: 'help',
    title: 'Contextual Help System',
    description: 'Press Ctrl+/ anywhere to access AI-powered help. Get instant answers from SOPs, past emails, and webinar transcripts—all with confidence scores.',
    icon: <HelpCircle className="h-8 w-8" />,
    position: 'center'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Start exploring your personalized command center. Remember: CARLOS learns from your patterns to surface what matters most.',
    icon: <Sparkles className="h-8 w-8" />,
    position: 'center'
  }
];

const TOUR_STORAGE_KEY = 'carlos-tour-completed';

export function PlatformTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!tourCompleted) {
      // Small delay to let the dashboard render first
      const timer = setTimeout(() => {
        setHasSeenTour(false);
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleComplete = useCallback(() => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setHasSeenTour(true);
    setIsOpen(false);
  }, []);

  const handleSkip = useCallback(() => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    setHasSeenTour(true);
    setIsOpen(false);
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentStep(0);
    setIsOpen(true);
  }, []);

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  if (hasSeenTour && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Restart Tour Button - shown after completion */}
      {hasSeenTour && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestart}
          className="fixed bottom-4 right-4 z-40 gap-2 shadow-lg"
        >
          <Rocket className="h-4 w-4" />
          Restart Tour
        </Button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={handleSkip}
            />

            {/* Tour Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2"
            >
              <Card className="relative overflow-hidden border-primary/20 bg-card shadow-2xl">
                {/* Progress Bar */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-muted">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Skip Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSkip}
                  className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Content */}
                <div className="p-8 pt-10">
                  {/* Icon */}
                  <motion.div
                    key={step.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                  >
                    {step.icon}
                  </motion.div>

                  {/* Title & Description */}
                  <motion.div
                    key={`content-${step.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                  >
                    <h2 className="mb-3 text-2xl font-bold text-foreground">
                      {step.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Step Indicators */}
                  <div className="mt-6 flex justify-center gap-2">
                    {tourSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentStep
                            ? 'w-6 bg-primary'
                            : index < currentStep
                            ? 'w-2 bg-primary/50'
                            : 'w-2 bg-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="mt-8 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      {currentStep + 1} of {tourSteps.length}
                    </span>

                    <Button onClick={handleNext} className="gap-2">
                      {currentStep === tourSteps.length - 1 ? (
                        'Get Started'
                      ) : (
                        <>
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
