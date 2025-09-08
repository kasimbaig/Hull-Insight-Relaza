import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/layout/MainLayout";
import Units from "./pages/masters/Units";
import Vessels from "./pages/masters/Vessels";
import Commands from "./pages/masters/Commands";
import ClassOfVessels from "./pages/masters/ClassOfVessels";
import Dockyards from "./pages/masters/Dockyards";
import Compartments from "./pages/masters/Compartments";
import Systems from "./pages/masters/Systems";
import Equipments from "./pages/masters/Equipments";
import DamageTypes from "./pages/masters/DamageTypes";
import Severities from "./pages/masters/Severities";
import OperationalStatuses from "./pages/masters/OperationalStatuses";
import InteractiveDrawing from "./pages/InteractiveDrawing";
import UserRoles from "./pages/UserRoles";
import UsersManagement from "./pages/UsersManagement";
import Modules from "./pages/masters/Modules";
import SubModules from "./pages/masters/SubModules";
import Reports from "./pages/Reports";
import HvacReport from "./pages/HvacReport";
import HvacTrialForm from "./pages/HvacTrialForm";
import DockingReportPage from "./pages/DockingReport";
import SurveyReportPage from "./pages/SurveyReport";
import DockingPlan from "./pages/DockingPlan";
import QuarterlyHullSurvey from "./pages/QuarterlyHullSurvey";
import ReportsSelection from "./pages/ReportsSelection";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

// Auth Route Component (redirect if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

// Landing Route Component (show landing page for unauthenticated users)
const LandingRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <LandingRoute>
          <Landing />
        </LandingRoute>
      } />
      <Route path="/login" element={
        <AuthRoute>
          <Login />
        </AuthRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/units" element={
        <ProtectedRoute>
          <MainLayout>
            <Units />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/vessels" element={
        <ProtectedRoute>
          <MainLayout>
            <Vessels />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/commands" element={
        <ProtectedRoute>
          <MainLayout>
            <Commands />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/class-of-vessels" element={
        <ProtectedRoute>
          <MainLayout>
            <ClassOfVessels />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/dockyards" element={
        <ProtectedRoute>
          <MainLayout>
            <Dockyards />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/compartments" element={
        <ProtectedRoute>
          <MainLayout>
            <Compartments />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/systems" element={
        <ProtectedRoute>
          <MainLayout>
            <Systems />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/equipments" element={
        <ProtectedRoute>
          <MainLayout>
            <Equipments />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/damage-types" element={
        <ProtectedRoute>
          <MainLayout>
            <DamageTypes />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/severities" element={
        <ProtectedRoute>
          <MainLayout>
            <Severities />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/operational-statuses" element={
        <ProtectedRoute>
          <MainLayout>
            <OperationalStatuses />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/modules" element={
        <ProtectedRoute>
          <MainLayout>
            <Modules />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/submodules" element={
        <ProtectedRoute>
          <MainLayout>
            <SubModules />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/masters/*" element={
        <ProtectedRoute>
          <MainLayout>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Master Page</h2>
                <p className="text-muted-foreground">This master section is under development.</p>
              </div>
            </div>
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/dockyard-plans" element={
        <ProtectedRoute>
          <MainLayout>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Dockyard Plan Approval</h2>
                <p className="text-muted-foreground">Manage dockyard plans and approval workflows.</p>
              </div>
            </div>
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/surveys" element={
        <ProtectedRoute>
          <MainLayout>
            <QuarterlyHullSurvey />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/drawing" element={
        <ProtectedRoute>
          <MainLayout>
            <InteractiveDrawing />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/hvac-trials" element={
        <ProtectedRoute>
          <MainLayout>
            <HvacTrialForm />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/hvac-report" element={
        <ProtectedRoute>
          <MainLayout>
            <HvacReport />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/dashboards" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <MainLayout>
            <ReportsSelection />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports/docking" element={
        <ProtectedRoute>
          <MainLayout>
            <DockingReportPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports/survey" element={
        <ProtectedRoute>
          <MainLayout>
            <SurveyReportPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports/hvac" element={
        <ProtectedRoute>
          <MainLayout>
            <Reports />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/dockyard-plan-approval" element={
        <ProtectedRoute>
          <MainLayout>
            <DockingPlan />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/users/user-roles" element={
        <ProtectedRoute>
          <MainLayout>
            <UserRoles />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/users/users-management" element={
        <ProtectedRoute>
          <MainLayout>
            <UsersManagement />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <MainLayout>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
                <p className="text-muted-foreground">Configure system settings and preferences.</p>
              </div>
            </div>
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
