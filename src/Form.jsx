import React, { PropTypes, Component } from 'react';

import isPlainObject from 'lodash/isPlainObject';
import noop from 'lodash/noop';

export default class Form extends Component {
  static propTypes = {
    onRequestSave: PropTypes.func
  };

  static defaultProps = {
    onRequestSave: noop
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      attrs: {},
      errors: {}
    };
  }

  edit(attrs = {}) {
    this.setState({
      errors: {},
      attrs
    });
  }

  save() {
    return this.props.onRequestSave(this.get(), this);
  }

  cancel() {
    this.setState({
      attrs: {},
      errors: {}
    });
  }

  get(attr) {
    if (!attr) {
      return this.state.attrs;
    }
    return this.state.attrs[attr];
  }

  set(attr, value) {
    this.setState({
      attrs: { ...this.state.attrs, [attr]: value }
    });
  }

  setErrors(errors) {
    this.setState({ errors: errors || {} });
  }

  getError(name) {
    return this.state.errors[name] ? this.state.errors[name][0] : '';
  }

  changed(attr) {
    if (typeof this[`$$${attr}`] !== 'function') {
      this._defineAttributeHandler(attr);
    }
    return this[`$$${attr}`];
  }

  input(name) {
    return {
      name: name,
      value: this.get(name),
      onChange: this.changed(name),
      errorText: this.getError(name)
    };
  }

  render() {
    return this.renderBody();
  }

  _defineAttributeHandler(attribute) {
    const handler = this[`$${attribute}`] || this._defaultAttributeHandler;
    this[`$$${attribute}`] = function() {
      const result = handler.apply(this, arguments);

      if (isPlainObject(result)) {
        this.setState({ attrs: { ...this.state.attrs, ...result } });
      } else {
        this.setState({ attrs: { ...this.state.attrs, [attribute]: result } });
      }
    }.bind(this);
  }

  _defaultAttributeHandler(value) {
    return value;
  }
};
