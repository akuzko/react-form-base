import React from 'react';
import marked from 'marked';
import Source from './Source';

const content = `
As mentioned in package [README](https://github.com/akuzko/react-form-base/blob/master/README.md)
any Form depends on usage with proper Input components. All examples bellow use
following \`TextField\` and \`Select\` components quickly built for demonstration.
`;

const textFieldSource = `
import React, { PropTypes } from 'react';

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
`;

const selectSource = `
import React, { PropTypes } from 'react';

export default function Select(props) {
  const { value, error, onChange, options, includeBlank, ...rest } = props;

  return (
    <div>
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} {...rest}>
        {includeBlank &&
          <option value="">{typeof includeBlank === 'string' ? includeBlank : 'None'}</option>
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
  includeBlank: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

Select.defaultProps = {
  includeBlank: false
};
`;

export default function InputPrerequisites() {
  return (
    <div className="pb-20 mb-20 border-bottom">
      <div className="mb-10 bold-text">Input Prerequisites</div>
      <div className="mb-20" dangerouslySetInnerHTML={{ __html: marked(content) }} />

      <div className="horizontal-container">
        <div className="flex-item mr-20">
          <Source title="TextField.jsx">{textFieldSource}</Source>
        </div>
        <div className="flex-item">
          <Source title="Select.jsx">{selectSource}</Source>
        </div>
      </div>
    </div>
  );
}
