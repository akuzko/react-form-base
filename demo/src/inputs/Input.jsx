import React, { PropTypes, Component } from 'react';

export default class Input extends Component {
  static propTypes = {
    value: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func
  };

  onChange = (e) => {
    this.props.onChange(e.target.value);
  };

  render() {
    const { value, error, onChange, ...rest } = this.props; // eslint-disable-line no-unused-vars

    return (
      <div>
        <input value={value} onChange={this.onChange} {...rest} />
        {error &&
          <div className="error">{error}</div>
        }
      </div>
    );
  }
}
