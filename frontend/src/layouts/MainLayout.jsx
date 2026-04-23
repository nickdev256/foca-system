import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DashboardSidebar from '../components/layout/DashboardSidebar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  const location = useLocation();

  // FIX: include ALL dashboard-related pages
  const showSidebar =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/pastor');

  return (
    <>
      <Navbar />

      <div style={{ display: 'flex' }}>
        {showSidebar && <DashboardSidebar />}

        <main style={{ minHeight: '80vh', flex: 1 }}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}