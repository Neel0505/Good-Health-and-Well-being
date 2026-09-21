const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  min,
  max,
  step,
  as = 'input',
  options = [],
  rows = 3,
  helpText,
}) => {
  const id = `field-${name}`;
  const shared = {
    id,
    name,
    value: value ?? '',
    onChange,
    className: `form-control ${error ? 'is-invalid' : ''}`,
    placeholder,
    required,
    min,
    max,
    step,
  };

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      {as === 'select' ? (
        <select {...shared} className={`form-select ${error ? 'is-invalid' : ''}`}>
          {options.map((opt) =>
            typeof opt === 'string' ? (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ) : (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            )
          )}
        </select>
      ) : as === 'textarea' ? (
        <textarea {...shared} rows={rows} />
      ) : (
        <input {...shared} type={type} />
      )}
      {helpText && !error && <div className="form-text">{helpText}</div>}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default FormInput;
