import { Link, NavLink } from 'react-router-dom';

const PublicNavbar = () => (
  <nav className="navbar navbar-expand-lg public-navbar sticky-top">
    <div className="container">
      <Link className="navbar-brand brand-mark" to="/">
        <span className="brand-icon">
          <i className="bi bi-heart-pulse" />
        </span>
        FitTrack
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#publicNav"
        aria-controls="publicNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="publicNav">
        <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/about">
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="btn btn-brand ms-lg-2" to="/register">
              Get Started
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default PublicNavbar;
