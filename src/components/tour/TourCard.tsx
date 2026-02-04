import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TourStep } from './tourSteps';

interface TourCardProps {
  step: TourStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onStepClick: (index: number) => void;
}

interface CardPosition {
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  transform?: string;
}

export function TourCard({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  onStepClick,
}: TourCardProps) {
  const [position, setPosition] = useState<CardPosition>({
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  });

  const calculatePosition = useCallback(() => {
    if (!step.selector || step.position === 'center') {
      setPosition({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      });
      return;
    }

    const element = document.querySelector(step.selector);
    if (!element) {
      setPosition({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      });
      return;
    }

    const bounds = element.getBoundingClientRect();
    const cardWidth = 450;
    const cardHeight = 320;
    const gap = 24;

    switch (step.position) {
      case 'right':
        setPosition({
          top: Math.max(20, Math.min(bounds.top, window.innerHeight - cardHeight - 20)),
          left: Math.min(bounds.right + gap, window.innerWidth - cardWidth - 20),
        });
        break;
      case 'left':
        setPosition({
          top: Math.max(20, Math.min(bounds.top, window.innerHeight - cardHeight - 20)),
          left: Math.max(20, bounds.left - cardWidth - gap),
        });
        break;
      case 'bottom':
        setPosition({
          top: Math.min(bounds.bottom + gap, window.innerHeight - cardHeight - 20),
          left: Math.max(20, Math.min(bounds.left, window.innerWidth - cardWidth - 20)),
        });
        break;
      case 'top':
        setPosition({
          top: Math.max(20, bounds.top - cardHeight - gap),
          left: Math.max(20, Math.min(bounds.left, window.innerWidth - cardWidth - 20)),
        });
        break;
      default:
        setPosition({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        });
    }
  }, [step.selector, step.position]);

  useEffect(() => {
    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);
    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [calculatePosition]);

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed z-[60] w-full max-w-md pointer-events-auto"
      style={position}
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
          onClick={onSkip}
          className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Content */}
        <div className="p-8 pt-10">
          {/* Icon */}
          <motion.div
            key={`icon-${step.id}`}
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
            {Array.from({ length: totalSteps }).map((_, index) => (
              <button
                key={index}
                onClick={() => onStepClick(index)}
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
              onClick={onPrev}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <span className="text-sm text-muted-foreground">
              {currentStep + 1} of {totalSteps}
            </span>

            <Button onClick={onNext} className="gap-2">
              {currentStep === totalSteps - 1 ? (
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
  );
}
