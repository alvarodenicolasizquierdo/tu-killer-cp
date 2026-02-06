import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { DraftsProvider } from "@/contexts/DraftsContext";
import { HelpDrawer } from "@/components/help/HelpDrawer";
import { PlatformTour } from "@/components/tour/PlatformTour";
import Dashboard from "./pages/Dashboard";
import TRFs from "./pages/TRFs";
import TRFDetail from "./pages/TRFDetail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import SuppliersEnhanced from "./pages/SuppliersEnhanced";
import SupplierCreate from "./pages/SupplierCreate";
import SupplierInbox from "./pages/SupplierInbox";
import SupplierDetail from "./pages/SupplierDetail";
import Lab from "./pages/Lab";
import Inspections from "./pages/Inspections";
import InspectionDetail from "./pages/InspectionDetail";
import InspectionsEnhanced from "./pages/InspectionsEnhanced";
import InspectionCreate from "./pages/InspectionCreate";
import Insight from "./pages/Insight";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Styles from "./pages/Styles";
import StyleDetail from "./pages/StyleDetail";
import Components from "./pages/Components";
import TestingLevels from "./pages/TestingLevels";
import CareLabelling from "./pages/CareLabelling";
import GSW from "./pages/GSW";
import SelfApprovalLevels from "./pages/SelfApprovalLevels";
import SupportCenter from "./pages/SupportCenter";
import Documentation from "./pages/Documentation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <DraftsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/styles" element={<Styles />} />
              <Route path="/styles/:id" element={<StyleDetail />} />
              <Route path="/components" element={<Components />} />
              <Route path="/testing-levels" element={<TestingLevels />} />
              <Route path="/care-labelling" element={<CareLabelling />} />
              <Route path="/gsw" element={<GSW />} />
              <Route path="/approval-levels" element={<SelfApprovalLevels />} />
              <Route path="/trfs" element={<TRFs />} />
              <Route path="/trfs/:id" element={<TRFDetail />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/suppliers" element={<SuppliersEnhanced />} />
              <Route path="/suppliers/new" element={<SupplierCreate />} />
              <Route path="/suppliers/inbox" element={<SupplierInbox />} />
              <Route path="/suppliers/:id" element={<SupplierDetail />} />
              <Route path="/lab" element={<Lab />} />
              {/* Enhanced inspections module with table/kanban views */}
              <Route path="/inspections" element={<InspectionsEnhanced />} />
              <Route path="/inspections/new" element={<InspectionCreate />} />
              <Route path="/inspections/calendar" element={<Inspections />} />
              <Route path="/inspections/:id" element={<InspectionDetail />} />
              <Route path="/analytics" element={<Insight />} />
              <Route path="/notifications" element={<Dashboard />} />
              <Route path="/support-center" element={<SupportCenter />} />
              <Route path="/ai-assistant" element={<SupportCenter />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Global Help Drawer - available on all pages */}
            <HelpDrawer />
            {/* Platform Tour for new users */}
            <PlatformTour />
          </BrowserRouter>
        </TooltipProvider>
      </DraftsProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
