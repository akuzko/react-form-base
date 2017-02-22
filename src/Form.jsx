import React, { PropTypes, PureComponent } from 'react';

import { nameToPath, buildFormValidator } from './utils';
import isPlainObject from 'lodash/isPlainObject';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import noop from 'lodash/noop';

export default class Form extends PureComponent {
  static propTypes = {
    attrs: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    clearErrorsOnChange: PropTypes.bool,
    validateOnChange: PropTypes.bool,
    validateOnSave: PropTypes.bool,
    onRequestSave: PropTypes.func
  };

  static defaultProps = {
    onChange: noop,
    clearErrorsOnChange: true,
    validateOnChange: true,
    validateOnSave: true,
    onRequestSave: noop
  };

  state = { errors: {} };
  validations = {};
  validator = buildFormValidator(this);

  componentWillReceiveProps() {
    if (this._nextErrors) {
      this.setState({ errors: this._nextErrors });
      this._nextErrors = null;
    }
  }

  save() {
    if (this.props.validateOnSave) {
      return this.ifValid(() => this._save());
    }
    return this._save();
  }

  _save() {
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
      error: this.getError(name)
    });

    return wrapper;
  }

  input(name) {
    return this.$(name);
  }

  get(name) {
    if (name === undefined) return this.props.attrs;

    return get(this.props.attrs, nameToPath(name));
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
    const newErrors = { ...this.getErrors() };

    updater(newAttrs, newErrors);

    this._nextErrors = newErrors;
    onChange(newAttrs);
  }

  _shouldClearError(name) {
    return this.props.clearErrorsOnChange && this.getError(name);
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

    return errors;
  }

  performValidation() {
    return this.ifValid();
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
    const attrs = cloneDeep(this.props.attrs);

    set(attrs, name, { ...current, ...value });
    this.props.onChange(attrs);
  }

  push(name, value) {
    const ary = this.get(name) || [];

    return this.set(name, [...ary, value]);
  }

  remove(name, i) {
    const ary = this.get(name);

    return this._set((attrs, errors) => {
      set(attrs, nameToPath(name), [...ary.slice(0, i), ...ary.slice(i + 1)]);
      this._updateErrors(errors, `${name}.${i}`, null);
    });
  }

  each(path, iteratee) {
    const value = this.get(path) || [];

    return value.forEach(iteratee);
  }

  map(path, iteratee) {
    const value = this.get(path) || [];

    return value.map(iteratee);
  }

  mapExtra(path, iteratee) {
    const value = this.get(path) || [];

    return [...value, null].map(iteratee);
  }

  getErrors() {
    return this.state.errors || {};
  }

  getError(name) {
    return this.getErrors()[name];
  }

  setErrors(errors, callback) {
    const hadErrors = Object.getOwnPropertyNames(errors).length > 0;

    this.setState({ hadErrors, errors }, callback);
  }

  render() {
    const $bound = this.$.bind(this);

    Object.defineProperty($bound, 'nested', {
      value: (name) => {
        const result = {
          attrs: this.get(name),
          onChange: (form) => this.merge(name, form)
        };
        return result;
      },
      enumerable: false
    });

    return this.$render($bound);
  }

  $render() {
    return null;
  }
};
