export default function StatCard({ title, value, icon }) {
  return (
    <div className="col-6 col-md-4 col-xl-2">
      <div className="card stat-card h-100 dashboard-stat-card">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <div className="text-muted small text-uppercase fw-semibold">{title}</div>
            <div className="stat-value">{value}</div>
          </div>
          <div className="stat-icon"><i className={`bi ${icon}`} /></div>
        </div>
      </div>
    </div>
  );
}
