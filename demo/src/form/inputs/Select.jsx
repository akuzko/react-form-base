import React, { PropTypes } from 'react';

export default function Select(props) {
  const { value, error, onChange, options, includeBlank, ...rest } = props; // eslint-disable-line no-unused-vars

  return (
    <div>
      <select value={value || ''} onChange={onSelectChange} {...rest}>
        {includeBlank &&
          <option value="">None</option>
        }
        {options.map((option, i) => {
          const { value, label } = typeof option === 'object' ? option : { value: option, label: option };

          return <option key={i} value={value}>{label}</option>;
        })}
      </select>
      {error &&
        <div className="error">{error}</div>
      }
    </div>
  );

  function onSelectChange(e) {
    return onChange(e.target.value);
  };
}

Select.propTypes = {
  value: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })])).isRequired,
  includeBlank: PropTypes.bool
};

Select.defaultProps = {
  includeBlank: false
};
