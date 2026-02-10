import { useState, useEffect, useCallback } from 'react';
import { tagEvent } from '@/utils/clarityTracking';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { tourSteps, TOUR_STORAGE_KEY } from './tourSteps';
import { TourSpotlight } from './TourSpotlight';
import { TourCard } from './TourCard';

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

  // Scroll highlighted elements into view when step changes
  useEffect(() => {
    if (!isOpen) return;
    
    const step = tourSteps[currentStep];
    if (!step.selector) return;
    
    const element = document.querySelector(step.selector);
    if (!element) return;
    
    // Use rAF to avoid forced reflow when reading geometric properties
    const rafId = requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      const isVisible = (
        rect.top >= 0 &&
        rect.bottom <= window.innerHeight
      );
      
      if (!isVisible) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    });
    
    return () => cancelAnimationFrame(rafId);
  }, [currentStep, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          if (currentStep < tourSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
          } else {
            handleComplete();
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
          }
          break;
        case 'Escape':
          event.preventDefault();
          handleSkip();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep]);

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
    tagEvent('platform_tour', 'start');
  }, []);

  const handleStepClick = useCallback((index: number) => {
    setCurrentStep(index);
  }, []);

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Restart Tour Button - shown after tour completion when not viewing tour */}
      {hasSeenTour && !isOpen && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestart}
          className="fixed bottom-4 right-4 z-40 gap-2 shadow-lg bg-background"
        >
          <Rocket className="h-4 w-4" />
          Restart Tour
        </Button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Spotlight overlay with cutout */}
            <TourSpotlight selector={step.selector} />

            {/* Tour Card */}
            <TourCard
              step={step}
              currentStep={currentStep}
              totalSteps={tourSteps.length}
              onNext={handleNext}
              onPrev={handlePrev}
              onSkip={handleSkip}
              onStepClick={handleStepClick}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
