import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import SubmitGrievance from './pages/SubmitGrievance';
import SubmissionSuccess from './pages/SubmissionSuccess';
import MyGrievances from './pages/MyGrievances';
import GrievanceDetails from './pages/GrievanceDetails';
import RateExperience from './pages/RateExperience';
import AuthorityDashboard from './pages/AuthorityDashboard';
import GrievanceQueue from './pages/GrievanceQueue';
import Workspace from './pages/Workspace';
import InformationRequest from './pages/InformationRequest';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import SystemInsights from './pages/SystemInsights';
import InstitutionalIssues from './pages/InstitutionalIssues';
import InstitutionalIssueDetail from './pages/InstitutionalIssueDetail';
import DuplicateReview from './pages/DuplicateReview';
import ResolutionWorkspace from './pages/ResolutionWorkspace';
import EscalationWorkspace from './pages/EscalationWorkspace';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/student">
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="submit" element={<SubmitGrievance />} />
            <Route path="success" element={<SubmissionSuccess />} />
            <Route path="grievances" element={<MyGrievances />} />
            <Route path="grievance/:id" element={<GrievanceDetails />} />
            <Route path="rate/:id" element={<RateExperience />} />
            <Route path="" element={<Navigate to="/student/dashboard" replace />} />
          </Route>
          <Route path="/authority">
            <Route path="dashboard" element={<AuthorityDashboard />} />
            <Route path="queue" element={<GrievanceQueue />} />
            <Route path="workspace/:id" element={<Workspace />} />
            <Route path="workspace/:id/resolve" element={<ResolutionWorkspace />} />
            <Route path="workspace/:id/escalate" element={<EscalationWorkspace />} />
            <Route path="workspace/:id/duplicate" element={<DuplicateReview />} />
            <Route path="request-info" element={<InformationRequest />} />
            <Route path="" element={<Navigate to="/authority/dashboard" replace />} />
          </Route>
          <Route path="/admin">
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="insights" element={<SystemInsights />} />
            <Route path="issues" element={<InstitutionalIssues />} />
            <Route path="issues/:id" element={<InstitutionalIssueDetail />} />
            <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
