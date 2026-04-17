import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Brain, LayoutDashboard, UserCircle, Target, Users, BarChart3, ShieldAlert, LogOut, UserCheck, ShieldCheck, Compass } from 'lucide-react';

const EMPLOYEE_LINKS = [
  { to: '/employee/dashboard', icon: LayoutDashboard, label: 'My Dashboard' },
  { to: '/employee/career', icon: Compass, label: 'Career Intelligence' },
  { to: '/employee/profile', icon: UserCircle, label: 'Profile Builder' },
  { to: '/employee/insights', icon: Target, label: 'AI Insights & Fit' },
  { to: '/employee/support', icon: ShieldCheck, label: 'Support & Safety' },
];

const HR_LINKS = [
  { to: '/hr/dashboard', icon: LayoutDashboard, label: 'Master Dashboard' },
  { to: '/hr/directory', icon: Users, label: 'Employee Directory' },
  { to: '/hr/comparison', icon: UserCheck, label: 'Compare Employees' },
  { to: '/hr/team-builder', icon: Target, label: 'Team Builder' },
  { to: '/hr/analytics', icon: BarChart3, label: 'Workforce Analytics' },
  { to: '/hr/alerts', icon: ShieldAlert, label: 'Alerts & Risks' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentUser, currentRole } = useApp();
  const links = currentRole === 'employee' ? EMPLOYEE_LINKS : HR_LINKS;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon"><Brain size={22} /></div>
        <div>
          <div className="logo-text">PeopleIQ</div>
          <div className="logo-sub">{currentRole === 'hr' ? 'HR Command Center' : 'Employee Portal'}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">{currentRole === 'employee' ? 'Self Service' : 'Command Center'}</div>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=User&background=6366f1&color=fff`} alt="User" />
          <div>
            <div className="sidebar-user-name">{currentUser?.name || 'User'}</div>
            <div className="sidebar-user-role capitalize">{currentRole === 'hr' ? 'HR Admin' : currentUser?.currentRole || 'Employee'}</div>
          </div>
        </div>
        <button className="btn btn-secondary signout-btn" onClick={() => navigate('/login')}>
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
