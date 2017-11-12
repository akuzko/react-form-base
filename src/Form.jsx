import { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';

import { noop, buildFormValidator, buildHandlersCache } from './utils';
import update from 'update-js';
import get from 'lodash.get';

const promiseSupported = typeof Promise === 'function';

export default class Form extends (PureComponent || Component) {
  static propTypes = {
    attrs: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    clearErrorsOnChange: PropTypes.bool,
    validateOnChange: PropTypes.bool,
    validateOnSave: PropTypes.bool,
    onRequestSave: PropTypes.func,
    onValidationFailed: PropTypes.func,
    validations: PropTypes.object,
    children: PropTypes.func
  };

  static defaultProps = {
    onChange: noop,
    clearErrorsOnChange: true,
    validateOnChange: true,
    validateOnSave: true,
    onRequestSave: noop
  };

  state = { errors: {} };
  validator = buildFormValidator(this);
  _handlersCache = buildHandlersCache();

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
    const handler = this._handlersCache.fetch(name, () => this.set.bind(this, name));

    const wrapper = (handler, ...bindings) => {
      wrapper.onChange = this._handlersCache.fetch([name, handler, ...bindings], () => {
        return handler.hasOwnProperty('prototype') ? handler.bind(this, ...bindings) : handler;
      });

      return wrapper;
    };
    Object.defineProperty(wrapper, 'name', { value: name, enumerable: true });
    Object.assign(wrapper, {
      value: this.get(name),
      onChange: handler,
      error: this.getError(name)
    });

    return wrapper;
  }

  input(name) {
    return this.$(name);
  }

  reset(attrs = {}) {
    this._nextErrors = {};
    this.props.onChange(attrs);
  }

  get(name) {
    if (name === undefined) return this.props.attrs;

    return get(this.props.attrs, name.split('.'));
  }

  set(name, value) {
    if (name && (typeof name === 'object') && (name.constructor === Object)) return this._setObject(name);

    return this._setAttr(name, value);
  }

  _setObject(obj) {
    return this._set((attrs, errors) => {
      for (const name in obj) {
        update.in(attrs, name, obj[name]);
        this._updateErrors(errors, name, obj[name]);
      }
    });
  }

  _setAttr(name, value) {
    return this._set((attrs, errors) => {
      update.in(attrs, name, value);
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
    const nextAttrs = { ...attrs };
    const nextErrors = { ...this.getErrors() };
    updater(nextAttrs, nextErrors);

    this._nextErrors = nextErrors;

    if (promiseSupported) {
      return new Promise((resolve) => {
        onChange(nextAttrs);
        setTimeout(resolve, 0);
      });
    }

    onChange(nextAttrs);
  }

  _shouldClearError(name) {
    return this.props.clearErrorsOnChange && this.getError(name);
  }

  _shouldValidateOnChange() {
    return this.props.validateOnChange && this.state.hadErrors;
  }

  get _validations() {
    const validationz = this.props.validations || this.validations || {};

    return typeof validationz === 'function' ? validationz.call(this) : validationz;
  }

  ifValid(callback) {
    const { onValidationFailed } = this.props;
    const errors = this.getValidationErrors();

    this.setErrors(errors, function() {
      const valid = Object.getOwnPropertyNames(errors).length === 0;

      if (valid && callback) {
        callback();
      }

      if (!valid && onValidationFailed) {
        onValidationFailed(errors, this);
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

  validate(validator) {
    for (const name in this._validations) {
      this._validate(name);
    }

    return validator.errors;
  }

  _validate(name) {
    if (name.includes('*')) {
      this._validateEach(name);
    } else {
      this.validator(name);
    }
  }

  _validateEach(name) {
    const match = name.match(/^([^*]+)\.\*(.+)?$/);
    const [collectionName, rest = ''] = match.slice(1);

    this.each(collectionName, (_item, i) => {
      this._validate(`${collectionName}.${i}${rest}`);
    });
  }

  merge(name, value) {
    const current = this.get(name) || {};

    return this.set(name, { ...current, ...value });
  }

  push(name, value) {
    const ary = this.get(name) || [];

    return this.set(name, [...ary, value]);
  }

  remove(name, i) {
    const ary = this.get(name);

    return this._set((attrs, errors) => {
      update.in(attrs, name, [...ary.slice(0, i), ...ary.slice(i + 1)]);
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

  updateErrors(errors, callback) {
    return this.setErrors({ ...this.getErrors(), ...errors }, callback);
  }

  setError(name, error, callback) {
    return this.updateErrors({ [name]: error }, callback);
  }

  render() {
    const $bound = this._bind$();
    const { children: renderer } = this.props;

    if (typeof renderer === 'function') {
      return renderer($bound);
    }

    return this.$render($bound);
  }

  _bind$() {
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

    return $bound;
  }

  $render() {
    return null;
  }
};
