export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 page-header">
      <div>
        {eyebrow && <p className="text-uppercase text-muted mb-1 fw-semibold">{eyebrow}</p>}
        <h2 className="mb-0">{title}</h2>
        {subtitle && <p className="text-muted mb-0 mt-1">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}
