import React, { PropTypes, Component } from 'react';

import { fullPath, fullName, pathToName, nameToPath, buildFormValidator } from '../utils';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import range from 'lodash/range';
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

  $(name) {
    const wrapper = (handler, ...bindings) => {
      wrapper.onChange = handler.hasOwnProperty('prototype') ? handler.bind(this, ...bindings) : handler;
      return wrapper;
    }
    Object.defineProperty(wrapper, 'name', { value: isString(name) ? name : fullName(name), enumerable: true });
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
    if (isString(name)) return this._get(nameToPath(name));
    if (isArray(name)) return this._get(fullPath(name));

    throw new Error(`${name.toString()} is not a valid input name` );
  }

  _get(path) {
    return get(this.props.attrs, path, '');
  }

  set(name, value) {
    if (isPlainObject(name)) return this._setObject(name);
    if (isString(name)) return this._setAttr(name, value);
    if (isArray(name)) return this._setAttr(fullName(name), value);

    throw new Error(`${name.toString()} is not a valid input name or value object`);
  }

  _setObject(obj) {
    return this._set((attrs, errors) => {
      for (const name of obj) {
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
    const { attrs, errors, clearErrorsOnChange, onChange } = this.props;
    const newAttrs = cloneDeep(this.props.attrs);
    const newErrors = { ...errors };

    updater(newAttrs, newErrors);

    return onChange(newAttrs, newErrors);
  }

  _shouldClearError(name) {
    const { clearErrorsOnChange, errors } = this.props;
    return clearErrorsOnChange && errors[name];
  }

  _shouldValidateOnChange() {
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

  merge(name, value) {
    const current = this.get(name) || {};

    return this.set(name, { ...current, ...value });
  }

  getErr(name) {
    if (name === undefined) return this.props.errors;
    if (isArray(name)) return this.getErr(fullName(name))

    return this.props.errors[name];
  }

  setErrors(errs) {
    const { onChange, attrs, errors } = this.props;

    onChange(attrs, { ...errors, ...errs });
  }

  mapExtraIn(path, iteratee) {
    const value = this.get(path) || [];

    return range(value.length + 1).map(iteratee);
  }

  render() {
    return null;
  }
};
