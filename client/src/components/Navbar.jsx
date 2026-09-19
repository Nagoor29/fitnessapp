import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  LogOut,
  Dumbbell,
  Brain,
  Layers,
  User,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 600,
    padding: '0.45rem 0.85rem',
    borderRadius: '0.6rem',
    transition: 'all var(--transition-fast)',
    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
    background: isActive ? 'rgba(0, 245, 155, 0.08)' : 'transparent',
    border: isActive ? '1px solid rgba(0, 245, 155, 0.2)' : '1px solid transparent',
  });

  return (
    <nav className="navbar" id="main-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/" className="nav-brand" id="brand-link">
          <div className="nav-logo-badge">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div className="brand-text">
            FitPulse <span>AI</span>
          </div>
        </Link>

        {isAuthenticated && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }} className="desktop-nav-links">
            <NavLink to="/dashboard" style={navLinkStyle}>
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/workouts" style={navLinkStyle}>
              <Dumbbell size={16} />
              <span>Workouts</span>
            </NavLink>
            <NavLink to="/ai-coach" style={navLinkStyle}>
              <Brain size={16} color="var(--accent-purple)" />
              <span>AI Coach</span>
            </NavLink>
            <NavLink to="/exercises" style={navLinkStyle}>
              <Layers size={16} />
              <span>Exercises</span>
            </NavLink>
            <NavLink to="/3d-preview" style={navLinkStyle}>
              <Sparkles size={16} color="var(--accent-primary)" />
              <span>3D Motion</span>
            </NavLink>
            <NavLink to="/profile" style={navLinkStyle}>
              <User size={16} />
              <span>Profile</span>
            </NavLink>
          </div>
        )}
      </div>

      <div className="nav-actions">
        {!isAuthenticated && (
          <NavLink to="/3d-preview" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', borderColor: 'rgba(0, 245, 155, 0.3)' }}>
            <Sparkles size={15} color="var(--accent-primary)" />
            <span>3D Demo</span>
          </NavLink>
        )}
        {isAuthenticated && user ? (
          <>
            <Link to="/profile" className="user-tag" id="user-profile-badge" title={`Signed in as ${user.email}`} style={{ textDecoration: 'none' }}>
              <div className="user-tag-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontWeight: 500 }}>{user.name}</span>
              <ShieldCheck size={16} color="var(--accent-primary)" />
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-danger btn-sm"
              id="logout-btn"
              title="End session"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login-btn">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
