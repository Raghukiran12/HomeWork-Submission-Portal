export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="input-group">
      <span className="input-group-text"><i className="bi bi-search" /></span>
      <input className="form-control" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
