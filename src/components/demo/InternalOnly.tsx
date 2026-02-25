import { useDemoMode } from '@/contexts/DemoModeContext';
import { ReactNode } from 'react';

interface InternalOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrapper that hides internal/development content when Demo Mode is active.
 * Use this around admin controls, AI debug panels, mock data badges, etc.
 */
export const InternalOnly = ({ children, fallback = null }: InternalOnlyProps) => {
  const { isDemoMode } = useDemoMode();
  if (isDemoMode) return <>{fallback}</>;
  return <>{children}</>;
};
