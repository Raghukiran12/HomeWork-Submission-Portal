export default function FormSelect({ label, options, error, ...props }) {
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <select className={`form-select${error ? ' is-invalid' : ''}`} {...props}>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>{option.label || option}</option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
