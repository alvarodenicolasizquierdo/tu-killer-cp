import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TourSpotlightProps {
  selector?: string;
  padding?: number;
}

export function TourSpotlight({ selector, padding = 12 }: TourSpotlightProps) {
  const [rect, setRect] = useState<SpotlightRect | null>(null);

  useEffect(() => {
    if (!selector) {
      setRect(null);
      return;
    }

    let rafId: number;
    const updateRect = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const element = document.querySelector(selector);
        if (element) {
          const bounds = element.getBoundingClientRect();
          setRect({
            top: bounds.top - padding,
            left: bounds.left - padding,
            width: bounds.width + padding * 2,
            height: bounds.height + padding * 2,
          });
        } else {
          setRect(null);
        }
      });
    };

    // Delay initial calculation to account for smooth scroll animation
    const initialTimer = setTimeout(() => {
      updateRect();
    }, 350);

    // Recalculate on scroll/resize
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);

    return () => {
      clearTimeout(initialTimer);
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [selector, padding]);

  if (!rect) {
    // No element to highlight - show full overlay
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />
    );
  }

  // Create a spotlight effect using clip-path
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 pointer-events-none"
    >
      {/* Dark overlay with cutout */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            {/* White = visible (dark overlay), Black = hidden (spotlight hole) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <motion.rect
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              x={rect.left}
              y={rect.top}
              width={rect.width}
              height={rect.height}
              rx="12"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.6)"
          mask="url(#spotlight-mask)"
          style={{ backdropFilter: 'blur(4px)' }}
        />
      </svg>

      {/* Glow border around spotlight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute rounded-xl border-2 border-primary shadow-[0_0_30px_rgba(59,130,246,0.5)]"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        }}
      />
    </motion.div>
  );
}
