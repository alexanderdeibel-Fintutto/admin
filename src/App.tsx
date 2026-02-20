import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Bundles from "./pages/Bundles";
import Analytics from "./pages/Analytics";
import Errors from "./pages/Errors";
import AICenter from "./pages/AICenter";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import UrlCheck from "./pages/UrlCheck";
import Partners from "./pages/Partners";
import Leads from "./pages/Leads";
import AppRegistry from "./pages/AppRegistry";
import Organizations from "./pages/Organizations";
import Subscriptions from "./pages/Subscriptions";
import AIConfig from "./pages/AIConfig";
import Services from "./pages/Services";
import Tools from "./pages/Tools";
import Documents from "./pages/Documents";
import Properties from "./pages/Properties";
import Notifications from "./pages/Notifications";
import RolesSecurity from "./pages/RolesSecurity";
import Finance from "./pages/Finance";
import Community from "./pages/Community";
import DevOps from "./pages/DevOps";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/bundles" element={<Bundles />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/errors" element={<Errors />} />
            <Route path="/ai-center" element={<AICenter />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/url-check" element={<UrlCheck />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/app-registry" element={<AppRegistry />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/ai-config" element={<AIConfig />} />
            <Route path="/services" element={<Services />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/roles-security" element={<RolesSecurity />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/community" element={<Community />} />
            <Route path="/devops" element={<DevOps />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
