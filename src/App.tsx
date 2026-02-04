import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Dashboard from "./pages/Dashboard";
import TRFs from "./pages/TRFs";
import TRFDetail from "./pages/TRFDetail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Suppliers from "./pages/Suppliers";
import Lab from "./pages/Lab";
import Inspections from "./pages/Inspections";
import InspectionDetail from "./pages/InspectionDetail";
import Analytics from "./pages/Analytics";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trfs" element={<TRFs />} />
            <Route path="/trfs/:id" element={<TRFDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/inspections" element={<Inspections />} />
            <Route path="/inspections/:id" element={<InspectionDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Dashboard />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
