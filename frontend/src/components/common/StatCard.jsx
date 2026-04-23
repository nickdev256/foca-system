export default function StatCard({ label, value, note }) {
  return (
    <div className="stat-card">
      <h4>{label}</h4>
      <strong>{value}</strong>
      {note && <span>{note}</span>}
    </div>
  );
}
