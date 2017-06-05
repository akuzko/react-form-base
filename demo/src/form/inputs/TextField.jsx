import React from 'react';
import PropTypes from 'prop-types';

export default function TextField(props) {
  const { value, error, onChange, ...rest } = props;

  return (
    <div>
      <input value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
      {error &&
        <div className="error">{error}</div>
      }
    </div>
  );
}

TextField.propTypes = {
  value: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func
};

TextField.defaultProps = {
  value: ''
};
