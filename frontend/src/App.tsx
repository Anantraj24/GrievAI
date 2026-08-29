import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DemoRoleSwitcher } from './components/common/DemoRoleSwitcher';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import { NotFound, Unauthorized } from './pages/NotFound';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import SubmitGrievance from './pages/SubmitGrievance';
import SubmissionSuccess from './pages/SubmissionSuccess';
import MyGrievances from './pages/MyGrievances';
import GrievanceDetails from './pages/GrievanceDetails';
import RateExperience from './pages/RateExperience';
import StudentNotifications from './pages/StudentNotifications';
import StudentProfile from './pages/StudentProfile';

// Authority Pages
import AuthorityDashboard from './pages/AuthorityDashboard';
import GrievanceQueue from './pages/GrievanceQueue';
import Workspace from './pages/Workspace';
import ResolutionWorkspace from './pages/ResolutionWorkspace';
import EscalationWorkspace from './pages/EscalationWorkspace';
import DuplicateReview from './pages/DuplicateReview';
import InformationRequest from './pages/InformationRequest';
import AuthorityAnalytics from './pages/AuthorityAnalytics';
import { AuthorityNotifications, AuthoritySettings } from './pages/AuthorityNotifications';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import SystemInsights from './pages/SystemInsights';
import { InstitutionalIssues } from './pages/InstitutionalIssues';
import { InstitutionalIssueDetail } from './pages/InstitutionalIssueDetail';
import { AdminUsers } from './pages/AdminUsers';
import { AdminDepartments } from './pages/AdminDepartments';
import { AdminCategories } from './pages/AdminCategories';
import { AdminSLA } from './pages/AdminSLA';
import { AdminAuditLogs, AdminSettings } from './pages/AdminAuditLogs';

// Protected Route Guard
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: Array<'student' | 'authority' | 'admin'>;
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Root index redirect - always lands on login page when opening app
const RootRedirect: React.FC = () => {
  return <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          {/* 1-Click Floating Demo Role Switcher for Seamless Testing */}
          <DemoRoleSwitcher />

          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<RootRedirect />} />

            {/* Student Portal Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/submit"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <SubmitGrievance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/success"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <SubmissionSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/grievances"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <MyGrievances />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/grievance/:id"
              element={
                <ProtectedRoute allowedRoles={['student', 'authority', 'admin']}>
                  <GrievanceDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/rate/:id"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <RateExperience />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <StudentNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={['student', 'admin']}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            {/* Authority Portal Routes */}
            <Route
              path="/authority/dashboard"
              element={
                <ProtectedRoute allowedRoles={['authority', 'admin']}>
                  <AuthorityDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authority/queue"
              element={
                <ProtectedRoute allowedRoles={['authority', 'admin']}>
                  <GrievanceQueue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authority/workspace/:id"
              element={
                <ProtectedRoute allowedRoles={['authority', 'admin']}>
                  <Workspace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authority/workspace/:id/resolve"
              element={
                <ProtectedRoute allowedRoles={['authority', 'admin']}>
                  <ResolutionWorkspace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authority/workspace/:id/escalate"
              element={
                <ProtectedRoute allowedRoles={['authority', 'admin']}>
                  <EscalationWorkspace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authority/workspace/:id/duplicate"
              element={
                <ProtectedRoute allowedRoles={['authority', 'admin']}>
                  <DuplicateReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authority/request-info"
              element={
                <ProtectedRoute allowedRoles={['authority', 'admin']}>
                  <InformationRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authority/analytics"
              element={
                <ProtectedRoute allowedRoles={['authority', 'admin']}>
                  <AuthorityAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authority/notifications"
              element={
                <ProtectedRoute allowedRoles={['authority', 'admin']}>
                  <AuthorityNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authority/settings"
              element={
                <ProtectedRoute allowedRoles={['authority', 'admin']}>
                  <AuthoritySettings />
                </ProtectedRoute>
              }
            />

            {/* Admin Command Center Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/insights"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SystemInsights />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/issues"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <InstitutionalIssues />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/issues/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <InstitutionalIssueDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDepartments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sla"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSLA />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAuditLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />

            {/* Error Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
