import React, { PropTypes, Component } from 'react';

export default class Select extends Component {
  static propTypes = {
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

  static defaultProps = {
    includeBlank: false
  };

  onChange = (e) => {
    this.props.onChange(e.target.value);
  };

  render() {
    const { value, error, onChange, options, includeBlank, ...rest } = this.props; // eslint-disable-line no-unused-vars

    return (
      <div>
        <select value={value || ''} onChange={this.onChange} {...rest}>
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
  }
}
