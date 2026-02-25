import { useDemoMode } from '@/contexts/DemoModeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { tagEvent } from '@/utils/clarityTracking';

export const DemoModeToggle = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const navigate = useNavigate();

  const handleReset = () => {
    navigate('/');
    toast.success('Demo reset', { description: 'Ready for next presentation' });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Switch
          checked={isDemoMode}
          onCheckedChange={() => {
            toggleDemoMode();
            tagEvent('demo_mode', isDemoMode ? 'off' : 'on');
          }}
          id="demo-mode"
        />
        <Label htmlFor="demo-mode" className="text-sm font-medium cursor-pointer">
          Demo
        </Label>
      </div>
      {isDemoMode && (
        <>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold tracking-wide dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
          >
            CLIENT VIEW
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs text-muted-foreground h-7 px-2"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </>
      )}
    </div>
  );
};
