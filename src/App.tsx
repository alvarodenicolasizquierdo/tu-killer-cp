import { lazy, Suspense, useEffect } from "react";
import { initClarityTracking } from "@/utils/clarityTracking";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { DraftsProvider } from "@/contexts/DraftsContext";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import { DemoRouteGuard } from "@/components/demo";
import { HelpDrawer } from "@/components/help/HelpDrawer";
import Dashboard from "./pages/Dashboard";

// Lazy-load all non-critical routes to reduce initial bundle size
const PlatformTour = lazy(() => import("@/components/tour/PlatformTour").then(m => ({ default: m.PlatformTour })));
const TRFs = lazy(() => import("./pages/TRFs"));
const TRFDetail = lazy(() => import("./pages/TRFDetail"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const SuppliersEnhanced = lazy(() => import("./pages/SuppliersEnhanced"));
const SupplierCreate = lazy(() => import("./pages/SupplierCreate"));
const SupplierInbox = lazy(() => import("./pages/SupplierInbox"));
const SupplierDetail = lazy(() => import("./pages/SupplierDetail"));
const Lab = lazy(() => import("./pages/Lab"));
const Inspections = lazy(() => import("./pages/Inspections"));
const InspectionDetail = lazy(() => import("./pages/InspectionDetail"));
const InspectionsEnhanced = lazy(() => import("./pages/InspectionsEnhanced"));
const InspectionCreate = lazy(() => import("./pages/InspectionCreate"));
const Insight = lazy(() => import("./pages/Insight"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Styles = lazy(() => import("./pages/Styles"));
const StyleDetail = lazy(() => import("./pages/StyleDetail"));
const Components = lazy(() => import("./pages/Components"));
const TestingLevels = lazy(() => import("./pages/TestingLevels"));
const CareLabelling = lazy(() => import("./pages/CareLabelling"));
const GSW = lazy(() => import("./pages/GSW"));
const SelfApprovalLevels = lazy(() => import("./pages/SelfApprovalLevels"));
const SupportCenter = lazy(() => import("./pages/SupportCenter"));
const Documentation = lazy(() => import("./pages/Documentation"));
const FeatureSpec = lazy(() => import("./pages/FeatureSpec"));

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initClarityTracking();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <DemoModeProvider>
        <DraftsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <DemoRouteGuard>
                <Suspense fallback={null}>
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
                    <Route path="/feature-spec" element={<FeatureSpec />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </DemoRouteGuard>
              <HelpDrawer />
              <Suspense fallback={null}>
                <PlatformTour />
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </DraftsProvider>
      </DemoModeProvider>
    </UserProvider>
  </QueryClientProvider>
  );
};

export default App;
