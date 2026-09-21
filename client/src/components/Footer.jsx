import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="row g-4">
        <div className="col-md-5">
          <div className="brand-mark mb-2">
            <span className="brand-icon">
              <i className="bi bi-heart-pulse" />
            </span>
            FitTrack
          </div>
          <p className="text-muted small mb-0">
            A personal health, nutrition and fitness tracker built to support everyday well-being
            and SDG 3: Good Health and Well-Being.
          </p>
        </div>
        <div className="col-md-3">
          <h2 className="h6">Explore</h2>
          <ul className="list-unstyled footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </div>
        <div className="col-md-4">
          <h2 className="h6">Note</h2>
          <p className="text-muted small mb-0">
            FitTrack is an educational tracking tool. It does not provide medical diagnosis or
            treatment advice.
          </p>
        </div>
      </div>
      <div className="footer-bottom mt-4 pt-3">
        <small className="text-muted">© {new Date().getFullYear()} FitTrack · WPL Project · SDG 3</small>
      </div>
    </div>
  </footer>
);

export default Footer;
