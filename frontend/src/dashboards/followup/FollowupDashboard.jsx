

export default function FollowupDashboard() {
  return (
    <DashboardHome
      title="Follow-Up Department Dashboard"
      cards={[
        { label: 'First-Time Guests', key: 'guests', fallback: 0, note: 'Newly captured visitors' },
        { label: 'Pending Follow-ups', key: 'pending_followups', fallback: 0, note: 'People awaiting calls or check-ins' },
        { label: 'Return Visitors', key: 'return_visitors', fallback: 0, note: 'Guests who came back again' },
        { label: 'Conversions', key: 'conversions', fallback: 0, note: 'Visitors entering membership path' }
      ]}
      summaryNote={{
        heading: 'Follow-Up Focus',
        body: 'Capture visitor details, assign follow-up, monitor response, and help connect new people into church life.'
      }}
      quickActions={[
        'Add Visitor',
        'Assign Follow-up',
        'Log Call',
        'Mark Return Visit'
      ]}
      focusAreas={[
        'Do not lose visitor records.',
        'Track every follow-up step clearly.',
        'Improve visitor retention and connection.'
      ]}
    />
  );
}