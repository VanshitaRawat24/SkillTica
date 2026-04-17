import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';

// Employee pages
import EmployeeDashboard from './pages/employee/Dashboard';
import ProfileBuilder from './pages/employee/ProfileBuilder';
import InsightsPage from './pages/employee/Insights';
import SupportPage from './pages/employee/Support';
import CareerHub from './pages/employee/CareerHub';

import AICoach from './components/AICoach';

// HR pages
import HrDashboard from './pages/hr/Dashboard';
import Directory from './pages/hr/Directory';
import EmployeeProfile from './pages/hr/EmployeeProfile';
import Comparison from './pages/hr/Comparison';
import TeamBuilder from './pages/hr/TeamBuilder';
import Analytics from './pages/hr/Analytics';
import Alerts from './pages/hr/Alerts';

const AppLayout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <main className="main-content">{children}</main>
    <AICoach />
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />

    {/* Employee Routes */}
    <Route path="/employee/dashboard" element={<AppLayout><EmployeeDashboard /></AppLayout>} />
    <Route path="/employee/career" element={<AppLayout><CareerHub /></AppLayout>} />
    <Route path="/employee/profile" element={<AppLayout><ProfileBuilder /></AppLayout>} />
    <Route path="/employee/insights" element={<AppLayout><InsightsPage /></AppLayout>} />
    <Route path="/employee/support" element={<AppLayout><SupportPage /></AppLayout>} />
    <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />

    {/* HR Routes */}
    <Route path="/hr/dashboard" element={<AppLayout><HrDashboard /></AppLayout>} />
    <Route path="/hr/directory" element={<AppLayout><Directory /></AppLayout>} />
    <Route path="/hr/employee/:id" element={<AppLayout><EmployeeProfile /></AppLayout>} />
    <Route path="/hr/comparison" element={<AppLayout><Comparison /></AppLayout>} />
    <Route path="/hr/team-builder" element={<AppLayout><TeamBuilder /></AppLayout>} />
    <Route path="/hr/analytics" element={<AppLayout><Analytics /></AppLayout>} />
    <Route path="/hr/alerts" element={<AppLayout><Alerts /></AppLayout>} />
    <Route path="/hr" element={<Navigate to="/hr/dashboard" replace />} />
  </Routes>
);

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
