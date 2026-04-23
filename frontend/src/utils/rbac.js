export const roles = {
  SUPER_ADMIN: 'super_admin',
  PASTOR: 'pastor',
  ADMIN: 'admin',
  FINANCE: 'finance',
  MEDIA: 'media',
  MINISTRY_LEADER: 'ministry_leader',
  FOLLOWUP: 'followup',
  MEMBER: 'member'
};

export const permissions = {
  VIEW_SUPER_ADMIN_DASHBOARD: 'view_super_admin_dashboard',
  VIEW_PASTOR_DASHBOARD: 'view_pastor_dashboard',
  VIEW_ADMIN_DASHBOARD: 'view_admin_dashboard',
  VIEW_FINANCE_DASHBOARD: 'view_finance_dashboard',
  VIEW_MEDIA_DASHBOARD: 'view_media_dashboard',
  VIEW_MINISTRY_LEADER_DASHBOARD: 'view_ministry_leader_dashboard',
  VIEW_FOLLOWUP_DASHBOARD: 'view_followup_dashboard',
  VIEW_MEMBER_DASHBOARD: 'view_member_dashboard',

  MANAGE_USERS: 'manage_users',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_REPORTS: 'view_reports',
  MANAGE_MEMBERS: 'manage_members',
  VIEW_MEMBERS: 'view_members',
  MANAGE_EVENTS: 'manage_events',
  VIEW_EVENTS: 'view_events',
  MANAGE_FINANCE: 'manage_finance',
  VIEW_FINANCE: 'view_finance',
  MANAGE_MEDIA: 'manage_media',
  VIEW_MEDIA: 'view_media',
  MANAGE_FOLLOWUP: 'manage_followup',
  VIEW_FOLLOWUP: 'view_followup',
  VIEW_ANNOUNCEMENTS: 'view_announcements',
  MANAGE_ANNOUNCEMENTS: 'manage_announcements',
  VIEW_ATTENDANCE: 'view_attendance',
  MANAGE_ATTENDANCE: 'manage_attendance',
  VIEW_PRAYER: 'view_prayer',
  MANAGE_PRAYER: 'manage_prayer'
};

export const rolePermissions = {
  super_admin: [
    ...Object.values(permissions)
  ],

  pastor: [
    permissions.VIEW_PASTOR_DASHBOARD,
    permissions.VIEW_MEMBERS,
    permissions.VIEW_EVENTS,
    permissions.VIEW_REPORTS,
    permissions.VIEW_ATTENDANCE,
    permissions.VIEW_PRAYER,
    permissions.MANAGE_PRAYER,
    permissions.VIEW_ANNOUNCEMENTS
  ],

  admin: [
    permissions.VIEW_ADMIN_DASHBOARD,
    permissions.VIEW_MEMBERS,
    permissions.MANAGE_MEMBERS,
    permissions.VIEW_EVENTS,
    permissions.MANAGE_EVENTS,
    permissions.VIEW_ATTENDANCE,
    permissions.MANAGE_ATTENDANCE,
    permissions.VIEW_ANNOUNCEMENTS,
    permissions.MANAGE_ANNOUNCEMENTS,
    permissions.VIEW_REPORTS
  ],

  finance: [
    permissions.VIEW_FINANCE_DASHBOARD,
    permissions.VIEW_FINANCE,
    permissions.MANAGE_FINANCE,
    permissions.VIEW_REPORTS
  ],

  media: [
    permissions.VIEW_MEDIA_DASHBOARD,
    permissions.VIEW_MEDIA,
    permissions.MANAGE_MEDIA,
    permissions.VIEW_EVENTS,
    permissions.VIEW_ANNOUNCEMENTS,
    permissions.MANAGE_ANNOUNCEMENTS
  ],

  ministry_leader: [
    permissions.VIEW_MINISTRY_LEADER_DASHBOARD,
    permissions.VIEW_MEMBERS,
    permissions.VIEW_EVENTS,
    permissions.VIEW_ATTENDANCE,
    permissions.MANAGE_ATTENDANCE,
    permissions.VIEW_REPORTS
  ],

  followup: [
    permissions.VIEW_FOLLOWUP_DASHBOARD,
    permissions.VIEW_FOLLOWUP,
    permissions.MANAGE_FOLLOWUP,
    permissions.VIEW_MEMBERS,
    permissions.VIEW_REPORTS
  ],

  member: [
    permissions.VIEW_MEMBER_DASHBOARD,
    permissions.VIEW_EVENTS,
    permissions.VIEW_ANNOUNCEMENTS
  ]
};

export function hasPermission(role, permission) {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) || false;
}