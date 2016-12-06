import React, { PropTypes, Component } from 'react';

import { handleChange, fullPath, fullName, pathToName, buildFormValidator } from '../utils';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import noop from 'lodash/noop';

export default class Form extends Component {
  static propTypes = {
    attrs: PropTypes.object.isRequired,
    errors: PropTypes.object,
    onChange: PropTypes.func,
    clearErrorsOnChange: PropTypes.bool,
    validateOnChange: PropTypes.bool,
    onRequestSave: PropTypes.func
  };

  static defaultProps = {
    errors: {},
    onChange: noop,
    clearErrorsOnChange: true,
    validateOnChange: false,
    onRequestSave: noop
  };

  state = {
    hadErrors: false
  };

  validations = {};
  validator = buildFormValidator(this);

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.errors)) {
      this.setState({ hadErrors: true });
    }
  }

  save() {
    return this.props.onRequestSave(this.get(), this);
  }

  $(...path) {
    const wrapper = (handler, ...bindings) => {
      wrapper.onChange = handler.hasOwnProperty('prototype') ? handler.bind(this, ...bindings) : handler;
      return wrapper;
    }
    Object.defineProperty(wrapper, 'name', { value: fullName(path), enumerable: true });
    Object.assign(wrapper, {
      value: this.get(...path),
      onChange: this.changed(...path),
      error: this.getErr(...path)
    });

    return wrapper;
  }

  input(...path) {
    return this.$(...path);
  }

  get(...path) {
    return this._get(fullPath(path));
  }

  _get(fullPath) {
    return get(this.props.attrs, fullPath, '');
  }

  set(...path) {
    const { attrs, errors, clearErrorsOnChange } = this.props;
    const newAttrs = cloneDeep(this.props.attrs);
    let newErrors = errors;

    if (isObject(path[0])) {
      for (const key of path[0]) {
        const name = pathToName(key);

        set(newAttrs, key, path[0][key]);

        if (this.shouldClearError(name)) {
          newErrors = { ...newErrors, [name]: null };
        }

        if (this.shouldValidateOnChange()) {
          newErrors = { ...newErrors, [name]: this.validator(name, { value: value }) };
        }
      }
    } else {
      const value = path.pop();
      const fpath = fullPath(path);
      const fname = fullName(path);

      set(newAttrs, fpath, value);

      if (this.shouldClearError(fname)) {
        newErrors = { ...newErrors, [fname]: null };
      }

      if (this.shouldValidateOnChange()) {
        newErrors = { ...newErrors, [fname]: this.validator(fname, { value: value }) };
      }
    }

    return this.props.onChange(newAttrs, newErrors);
  }

  shouldClearError(fullName) {
    const { clearErrorsOnChange, errors } = this.props;
    return clearErrorsOnChange && errors[fullName];
  }

  shouldValidateOnChange() {
    return this.props.validateOnChange && this.state.hadErrors;
  }

  performValidation() {
    this.validator.clearErrors();
    this.setErrors(this.validate(this.validator));
  }

  validate(validate) {
    for (let name in this.validations) {
      validate(name);
    }

    return validate.errors;
  }

  merge(...path) {
    const obj = path.pop();
    const current = this.get(...path) || {};

    return this.set(...[...path, { ...current, ...obj }]);
  }

  changed(...path) {
    return handleChange.bind(this, path);
  }

  getErr(...path) {
    if (!path.length) return this.props.errors;

    return this.props.errors[fullName(path)];
  }

  setErrors(errs) {
    const { onChange, attrs, errors } = this.props;
    onChange(attrs, { ...errors, ...errs });
  }

  render() {
    return null;
  }
};
