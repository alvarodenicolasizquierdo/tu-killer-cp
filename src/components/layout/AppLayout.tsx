import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileSidebar } from './MobileSidebar';


interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-lg border-b border-border/50 z-40 flex items-center px-4 gap-3">
        <MobileSidebar />
        <span className="font-semibold text-foreground">{title || 'CARLOS'}</span>
      </div>
      <main className="md:ml-[260px] min-h-screen pt-14 md:pt-0">
        <Header title={title} subtitle={subtitle} />
        <div className="p-4 md:p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
