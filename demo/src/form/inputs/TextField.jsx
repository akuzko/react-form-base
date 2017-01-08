import React, { PropTypes } from 'react';

export default function TextField(props) {
  const { value, error, onChange, ...rest } = props; // eslint-disable-line no-unused-vars

  return (
    <div>
      <input value={value} onChange={onInputChange} {...rest} />
      {error &&
        <div className="error">{error}</div>
      }
    </div>
  );

  function onInputChange(e) {
    return onChange(e.target.value);
  }
}

TextField.propTypes = {
  value: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func
};
