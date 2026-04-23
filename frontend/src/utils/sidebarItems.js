const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  PASTOR: 'pastor',
  FINANCE: 'finance',
  MEDIA: 'media',
  MINISTRY_LEADER: 'ministry_leader',
  FOLLOWUP: 'followup',
  MEMBER: 'member',
};

// Dashboard per role (important fix)
const dashboardPathByRole = {
  super_admin: '/dashboard/admin',
  admin: '/dashboard/admin',
  pastor: '/dashboard/pastor',
  finance: '/dashboard/finance',
  media: '/dashboard/media',
  ministry_leader: '/dashboard/ministry',
  followup: '/dashboard/followup',
  member: '/dashboard/member',
};

const sidebarItems = [
  {
    label: 'Dashboard',
    getPath: (role) => dashboardPathByRole[role] || '/dashboard/member',
    roles: Object.values(ROLES),
  },

  // ---------------- ADMIN / LEADERS ----------------
  {
    label: 'Members',
    path: '/dashboard/members',
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.MINISTRY_LEADER,
      ROLES.PASTOR,
    ],
  },
  {
    label: 'Visitors',
    path: '/dashboard/visitors',
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FOLLOWUP],
  },

  // ---------------- CHURCH CONTENT ----------------
  {
    label: 'Events',
    path: '/dashboard/events',
    roles: Object.values(ROLES),
  },
  {
    label: 'Announcements',
    path: '/dashboard/announcements',
    roles: Object.values(ROLES),
  },
  {
    label: 'Sermons',
    path: '/dashboard/sermons',
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.MEDIA,
      ROLES.MEMBER,
      ROLES.PASTOR,
    ],
  },

  // ---------------- MEMBER ACTIONS ----------------
  {
    label: 'Prayer Requests',
    path: '/dashboard/prayer',
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.PASTOR,
      ROLES.FOLLOWUP,
      ROLES.MEMBER,
    ],
  },
  {
    label: 'Counseling',
    path: '/dashboard/counseling',
    roles: [ROLES.SUPER_ADMIN, ROLES.PASTOR],
  },

  // ---------------- FINANCE ----------------
  {
    label: 'Giving',
    path: '/dashboard/giving',
    roles: Object.values(ROLES),
  },
  {
    label: 'Finance Dashboard',
    path: '/dashboard/finance',
    roles: [ROLES.SUPER_ADMIN, ROLES.FINANCE],
  },

  // ---------------- SYSTEM ----------------
  {
    label: 'Users',
    path: '/dashboard/users',
    roles: [ROLES.SUPER_ADMIN],
  },
];

// normalize role safely
function normalizeRole(role = '') {
  return String(role).trim().toLowerCase().replace(/\s+/g, '_');
}

// ✅ FIXED EXPORT (THIS IS WHAT YOU WERE MISSING)
export function getSidebarItems(role) {
  const normalized = normalizeRole(role);

  return sidebarItems
    .filter((item) => item.roles.includes(normalized))
    .map((item) => ({
      label: item.label,
      path: item.getPath
        ? item.getPath(normalized)
        : item.path,
    }));
}

export { sidebarItems };