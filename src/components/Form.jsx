import React, { PropTypes, Component } from 'react';

import { nameToPath, buildFormValidator } from '../utils';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import range from 'lodash/range';
import noop from 'lodash/noop';

export default class Form extends Component {
  static propTypes = {
    attrs: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    clearErrorsOnChange: PropTypes.bool,
    validateOnChange: PropTypes.bool,
    onRequestSave: PropTypes.func
  };

  static defaultProps = {
    onChange: noop,
    clearErrorsOnChange: true,
    validateOnChange: false,
    onRequestSave: noop
  };

  state = { errors: {} };
  validations = {};
  validator = buildFormValidator(this);

  // componentWillReceiveProps(nextProps) {
  //   this.setState({ hadErrors: Object.getOwnPropertyNames(nextProps.errors).length > 0 });
  // }

  save() {
    return this.props.onRequestSave(this.get(), this);
  }

  $(name) {
    const wrapper = (handler, ...bindings) => {
      wrapper.onChange = handler.hasOwnProperty('prototype') ? handler.bind(this, ...bindings) : handler;
      return wrapper;
    };
    Object.defineProperty(wrapper, 'name', { value: name, enumerable: true });
    Object.assign(wrapper, {
      value: this.get(name),
      onChange: this.set.bind(this, name),
      error: this.getErr(name)
    });

    return wrapper;
  }

  input(name) {
    return this.$(name);
  }

  get(name) {
    return get(this.props.attrs, nameToPath(name), '');
  }

  set(name, value) {
    if (isPlainObject(name)) return this._setObject(name);

    return this._setAttr(name, value);
  }

  _setObject(obj) {
    return this._set((attrs, errors) => {
      for (const name in obj) {
        set(attrs, nameToPath(name), obj[name]);
        this._updateErrors(errors, name, obj[name]);
      }
    });
  }

  _setAttr(name, value) {
    return this._set((attrs, errors) => {
      set(attrs, nameToPath(name), value);
      this._updateErrors(errors, name, value);
    });
  }

  _updateErrors(errors, name, value) {
    if (this._shouldClearError(name)) {
      errors[name] = null;
    }

    if (this._shouldValidateOnChange()) {
      errors[name] = this.validator(name, { value });
    }
  }

  _set(updater) {
    const { attrs, onChange } = this.props;
    const newAttrs = cloneDeep(attrs);
    const newErrors = { ...this.state.errors };

    updater(newAttrs, newErrors);

    return this.setState({ errors }, () => onChange(newAttrs));
  }

  _shouldClearError(name) {
    const { clearErrorsOnChange, errors } = this.props;
    return clearErrorsOnChange && errors[name];
  }

  _shouldValidateOnChange() {
    return this.props.validateOnChange && this.state.hadErrors;
  }

  ifValid(callback) {
    const errors = this.getValidationErrors();

    this.setErrors(errors, function() {
      if (callback && Object.getOwnPropertyNames(errors).length === 0) {
        callback();
      }
    });
  }

  performValidation() {
    this.ifValid();
  }

  getValidationErrors() {
    this.validator.clearErrors();
    return this.validate(this.validator);
  }

  validate(validate) {
    for (const name in this.validations) {
      validate(name);
    }

    return validate.errors;
  }

  merge(name, value) {
    const current = this.get(name) || {};
    const attrs = cloneDeep(this.props.attrs)

    set(attrs, name, { ...current, ...value });
    this.props.onChange(attrs);
  }

  spliceIn(name, i) {
    const ary = this.get(name);

    return this.set(name, [...ary.slice(0, i), ...ary.slice(i + 1)]);
  }

  mapExtraIn(path, iteratee) {
    const value = this.get(path) || [];

    return range(value.length + 1).map(iteratee);
  }

  eachIndexIn(path, iteratee) {
    const value = this.get(path) || [];

    for (let i = 0; i < value.length; i++) {
      iteratee(i);
    }
  }

  getErr(name) {
    if (name === undefined) return this.state.errors;

    return this.state.errors[name];
  }

  setErrors(errors) {
    const hadErrors = Object.getOwnPropertyNames(errors).length > 0;

    this.setState({ hadErrors, errors });
  }

  render() {
    return null;
  }
};
