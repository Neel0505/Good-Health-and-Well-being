import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const PublicLayout = () => (
  <div className="public-shell">
    <PublicNavbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
