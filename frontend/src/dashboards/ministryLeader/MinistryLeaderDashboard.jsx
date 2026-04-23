

export default function MinistryLeaderDashboard() {
  return (
    <DashboardHome
      title="Ministry Leader Dashboard"
      cards={[
        { label: 'Ministry Members', key: 'ministry_members', fallback: 0, note: 'People under your ministry' },
        { label: 'Attendance', key: 'attendance', fallback: 0, note: 'Ministry participation records' },
        { label: 'Programs', key: 'programs', fallback: 0, note: 'Scheduled ministry activities' },
        { label: 'Reports', key: 'reports', fallback: 0, note: 'Submitted ministry summaries' }
      ]}
      summaryNote={{
        heading: 'Ministry Leadership Focus',
        body: 'Manage ministry members, attendance, programs, coordination, and activity reporting for your department or fellowship.'
      }}
      quickActions={[
        'Record Attendance',
        'Create Program',
        'View Members',
        'Submit Report'
      ]}
      focusAreas={[
        'Lead ministry activities effectively.',
        'Track members and attendance accurately.',
        'Keep leadership informed through reports.'
      ]}
    />
  );
}