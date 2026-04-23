import { Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

// ✅ PUBLIC PAGES
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import MinistriesPage from './pages/public/MinistriesPage';
import GivingPage from './pages/public/GivingPage';
import ContactPage from './pages/public/ContactPage';
import Sermons from './pages/public/Sermons';
import Events from './pages/public/Events';

// (Optional - keep if you still want simple pages for others)
import SimplePublicPage from './pages/public/SimplePublicPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/shared/NotFoundPage';

import ProtectedRoute from './components/common/ProtectedRoute';

// Dashboards
import SuperAdminDashboard from './dashboards/superAdmin/SuperAdminDashboard';
import PastorDashboard from './dashboards/pastor/PastorDashboard';
import AdminDashboard from './dashboards/admin/AdminDashboard';
import FinanceDashboard from './dashboards/finance/FinanceDashboard';
import MediaDashboard from './dashboards/media/MediaDashboard';
import MinistryLeaderDashboard from './dashboards/ministryLeader/MinistryLeaderDashboard';
import FollowupDashboard from './dashboards/followup/FollowupDashboard';
import MemberDashboard from './dashboards/member/MemberDashboard';

// Modules
import MembersPage from './modules/members/MembersPage';
import VisitorsPage from './modules/visitors/VisitorsPage';
import EventsPage from './modules/events/EventsPage';
import SermonsPage from './modules/sermons/SermonsPage';
import FinancePage from './modules/finance/FinancePage';
import ReportsPage from './modules/reports/ReportsPage';
import AnnouncementsPage from './modules/announcements/AnnouncementsPage';
import PrayerPage from './modules/prayer/PrayerPage';
import CounselingPage from './modules/prayer/CounselingPage';
import UsersPage from './modules/members/UsersPage';

export default function App() {
  return (
    <Routes>

      {/* 🌍 PUBLIC ROUTES */}
      <Route element={<MainLayout />}>

        <Route path="/" element={<HomePage />} />

        {/* ✅ CORE PAGES (NOW REAL) */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/ministries" element={<MinistriesPage />} />
        <Route path="/giving" element={<GivingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/sermons" element={<Sermons/>} />
        <Route path="/events" element={<Events />} />

        {/* OPTIONAL (still simple pages) */}
        <Route
          path="/leadership"
          element={
            <SimplePublicPage
              title="Leadership"
              text="Meet FOCA leadership and ministry teams."
            />
          }
        />

        <Route
          path="/sermons"
          element={
            <SimplePublicPage
              title="Sermons"
              text="Life-changing messages and teachings."
            />
          }
        />

        <Route
          path="/events"
          element={
            <SimplePublicPage
              title="Events"
              text="Worship services, conferences, and fellowships."
            />
          }
        />

        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

      </Route>

      {/* 🔐 DASHBOARDS */}
      <Route
        path="/dashboard/super-admin"
        element={
          <ProtectedRoute roles={['super_admin']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/pastor"
        element={
          <ProtectedRoute roles={['pastor']}>
            <PastorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/finance"
        element={
          <ProtectedRoute roles={['finance', 'super_admin']}>
            <FinanceDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/media"
        element={
          <ProtectedRoute roles={['media']}>
            <MediaDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/ministry-leader"
        element={
          <ProtectedRoute roles={['ministry_leader']}>
            <MinistryLeaderDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/followup"
        element={
          <ProtectedRoute roles={['followup']}>
            <FollowupDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/member"
        element={
          <ProtectedRoute roles={['member']}>
            <MemberDashboard />
          </ProtectedRoute>
        }
      />

      {/* 📦 MODULES */}
      <Route path="/dashboard/members" element={<MembersPage />} />
      <Route path="/dashboard/visitors" element={<VisitorsPage />} />
      <Route path="/dashboard/events" element={<EventsPage />} />
      <Route path="/dashboard/sermons" element={<SermonsPage />} />
      <Route path="/dashboard/finance-center" element={<FinancePage />} />
      <Route path="/dashboard/report-center" element={<ReportsPage />} />
      <Route path="/dashboard/announcements" element={<AnnouncementsPage />} />
      <Route path="/dashboard/prayer" element={<PrayerPage />} />
      <Route path="/dashboard/counseling" element={<CounselingPage />} />
      <Route path="/dashboard/users" element={<UsersPage />} />

      {/* ❌ 404 */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
}