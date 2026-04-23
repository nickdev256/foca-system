import { buildCrudRouter } from './crudRoutes.js';
import { createCrudController } from '../controllers/genericController.js';

// MODELS
import Member from '../models/Member.js';
import Visitor from '../models/Visitor.js';
import Ministry from '../models/Ministry.js';
import Event from '../models/Event.js';
import Sermon from '../models/Sermon.js';
import PrayerRequest from '../models/PrayerRequest.js';
import Announcement from '../models/Announcement.js';
import FinanceTransaction from '../models/FinanceTransaction.js';
import CounselingSession from '../models/CounselingSession.js';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// 🔐 MIDDLEWARE
import { authorize, protect } from '../middleware/authMiddleware.js';

// 🔥 IMPORTANT: IMPORT CUSTOM ROUTE
import sermonsRoutes from './sermonRoutes.js';

/* =========================
   GENERIC ROUTES (SAFE)
========================= */
export const membersRouter = buildCrudRouter(
  createCrudController(Member, 'Member'),
  [protect]
);

export const visitorsRouter = buildCrudRouter(
  createCrudController(Visitor, 'Visitor'),
  [protect]
);

export const ministriesRouter = buildCrudRouter(
  createCrudController(Ministry, 'Ministry'),
  [protect]
);

export const eventsRouter = buildCrudRouter(
  createCrudController(Event, 'Event'),
  [protect]
);

/* =========================
   🔥 CUSTOM SERMON ROUTER (FIXED)
========================= */
export const sermonsRouter = sermonsRoutes;

/* =========================
   OTHER GENERIC ROUTES
========================= */
export const prayerRouter = buildCrudRouter(
  createCrudController(PrayerRequest, 'PrayerRequest'),
  [protect]
);

export const announcementsRouter = buildCrudRouter(
  createCrudController(Announcement, 'Announcement'),
  [protect]
);

export const financeRouter = buildCrudRouter(
  createCrudController(FinanceTransaction, 'FinanceTransaction'),
  [protect, authorize('super_admin', 'finance')]
);

export const counselingRouter = buildCrudRouter(
  createCrudController(CounselingSession, 'CounselingSession'),
  [protect]
);

export const attendanceRouter = buildCrudRouter(
  createCrudController(Attendance, 'Attendance'),
  [protect]
);

export const usersRouter = buildCrudRouter(
  createCrudController(User, 'User'),
  [protect, authorize('super_admin')]
);