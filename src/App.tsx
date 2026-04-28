import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import Immunizations from "./pages/Immunizations";
import Schedule from "./pages/Schedule";
import Reports from "./pages/Reports";
import PatientImmunizationRecord from "./pages/reports/PatientImmunizationRecord";
import MonthlyCoverageReport from "./pages/reports/MonthlyCoverageReport";
import VaccineInventoryStatus from "./pages/reports/VaccineInventoryStatus";
import SystemEvaluationSummary from "./pages/reports/SystemEvaluationSummary";
import Vaccines from "./pages/Vaccines";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
    <Route path="/immunizations" element={<ProtectedRoute><Immunizations /></ProtectedRoute>} />
    <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
    <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
    <Route path="/reports/patient-record" element={<ProtectedRoute><PatientImmunizationRecord /></ProtectedRoute>} />
    <Route path="/reports/monthly-coverage" element={<ProtectedRoute><MonthlyCoverageReport /></ProtectedRoute>} />
    <Route path="/reports/vaccine-inventory" element={<ProtectedRoute><VaccineInventoryStatus /></ProtectedRoute>} />
    <Route path="/reports/system-evaluation" element={<ProtectedRoute><SystemEvaluationSummary /></ProtectedRoute>} />
    <Route path="/vaccines" element={<ProtectedRoute><Vaccines /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
