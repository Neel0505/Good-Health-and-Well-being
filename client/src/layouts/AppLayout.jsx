import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/app/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: '/app/nutrition', label: 'Nutrition', icon: 'bi-egg-fried' },
  { to: '/app/workouts', label: 'Workouts', icon: 'bi-lightning-charge' },
  { to: '/app/progress', label: 'Progress', icon: 'bi-graph-up' },
  { to: '/app/health', label: 'Health', icon: 'bi-droplet-half' },
  { to: '/app/profile', label: 'Profile', icon: 'bi-person' },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`app-shell ${open ? 'sidebar-open' : ''}`}>
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <Link to="/app/dashboard" className="brand-mark text-decoration-none" onClick={() => setOpen(false)}>
            <span className="brand-icon">
              <i className="bi bi-heart-pulse" />
            </span>
            FitTrack
          </Link>
          <button
            type="button"
            className="btn btn-sm d-lg-none"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <i className={`bi ${link.icon}`} />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
            <div>
              <p className="mb-0 small fw-semibold">{user?.name}</p>
              <p className="mb-0 tiny text-muted">{user?.email}</p>
            </div>
          </div>
          <button type="button" className="btn btn-outline-light btn-sm w-100 mt-3" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2" />
            Logout
          </button>
        </div>
      </aside>

      {open && <div className="sidebar-backdrop d-lg-none" onClick={() => setOpen(false)} />}

      <div className="app-main">
        <header className="app-topbar">
          <button
            type="button"
            className="btn btn-light d-lg-none"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <i className="bi bi-list" />
          </button>
          <div className="ms-auto d-flex align-items-center gap-2">
            <Link to="/app/profile" className="btn btn-light btn-sm">
              <i className="bi bi-person me-1" />
              Profile
            </Link>
            <button type="button" className="btn btn-outline-secondary btn-sm d-none d-md-inline-flex" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
