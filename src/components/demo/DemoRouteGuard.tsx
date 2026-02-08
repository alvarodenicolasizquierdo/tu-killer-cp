import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDemoMode } from '@/contexts/DemoModeContext';

const DEMO_BLOCKED_ROUTES = [
  '/settings',
  '/documentation',
  '/feature-spec',
  '/approval-levels',
  '/admin',
  '/debug',
  '/config',
  '/dev',
  '/sandbox',
];

export const DemoRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { isDemoMode } = useDemoMode();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDemoMode && DEMO_BLOCKED_ROUTES.some(r => location.pathname.startsWith(r))) {
      navigate('/', { replace: true });
    }
  }, [isDemoMode, location.pathname, navigate]);

  return <>{children}</>;
};
