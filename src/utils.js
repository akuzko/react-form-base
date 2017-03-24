/* global WeakMap */
import set from 'lodash.set';

export function noop(){}

export function bindState(component, key = 'form') {
  return {
    attrs: (component.state && component.state[key]) || {},
    onChange: function(attrs) { return component.setState({ [key]: attrs }); }
  };
}

export function update(obj, name, value) {
  _update(obj, name, value);

  return obj;
}

export function updated(obj, name, value) {
  const current = { ...obj };

  return update(current, name, value);
}

function _update(current, name, value) {
  const match = name.match(/^([\w\d]+)\.?(.+)?$/);
  const { 1: key, 2: rest } = match;

  if (current[key] === undefined) {
    return set(current, name.split('.'), value);
  }
  if (!rest) {
    return current[key] = value;
  }

  current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
  _update(current[key], rest, value);
}

function wildcard(name) {
  return name.replace(/\d+/g, '*');
}

export function buildFormValidator(form) {
  function validate(name, options = {}) {
    const value = options.hasOwnProperty('value') ? options.value : form.get(name);
    const validator = options['with'] || form._validations[name] || form._validations[wildcard(name)];

    if (!validator) return null;

    const error = callValidator(validator);

    if (error) {
      return validate.addError(name, error);
    }

    return null;

    function callValidator(validator) {
      if (Array.isArray(validator)) {
        return callArrayValidator(validator);
      }
      if (typeof validator === 'string') {
        return callStringValidator(validator);
      }
      if (typeof validator === 'function') {
        return validator.call(form, value);
      }
      if (validator && (typeof validator === 'object')) {
        return callObjectValidator(validator);
      }
      throw new Error(`unable to use '${validator}' as validator function`);
    }

    function stringToValidator(name) {
      const validator = form.constructor.validations[name];

      if (!validator) throw new Error(`${name} validation rule is not defined`);

      return validator;
    }

    function callStringValidator(name, options) {
      return stringToValidator(name).call(form, value, options === true ? {} : options);
    }

    function callObjectValidator(obj) {
      for (const name in obj) {
        const error = callStringValidator(name, obj[name]);
        if (error) return error;
      }
    }

    function callArrayValidator(ary) {
      for (let i = 0; i < ary.length; i++) {
        const error = callValidator(ary[i]);
        if (error) return error;
      }
    }
  }

  Object.assign(validate, {
    errors: {},
    clearErrors() {
      this.errors = {};
    },
    addError(key, message) {
      this.errors[key] = message;
      return message;
    },
    nested(ref) {
      const errors = form.refs[ref].performValidation();

      if (Object.getOwnPropertyNames(errors).length > 0) {
        this.addError(ref, 'invalid');
      }
    }
  });

  return validate;
}

export function buildHandlersCache() {
  return new Cache;
}

class Cache {
  constructor() {
    this.store = {};
  }

  fetch(key, setter) {
    try {
      if (Array.isArray(key)) {
        return this.fetchComplex(key, setter);
      } else {
        return this.fetchSimple(key, setter);
      }
    } catch (_e) {
      return setter();
    }
  }

  fetchSimple(key, setter) {
    if (!(key in this.store)) {
      this.store[key] = setter();
    }

    return this.store[key];
  }

  fetchComplex([name, ...path], setter) {
    name = `_${name}`;
    let current = this.store[name] || (this.store[name] = new WeakMap);

    for (let i = 0; i < path.length - 1; i++) {
      if (typeof this.get(current, path[i]) === 'undefined') {
        const nextKey = path[i + 1];

        this.put(current, path[i],
          typeof nextKey === 'number' ||
          typeof nextKey === 'string' ||
          typeof nextKey === 'boolean' ?
          {} : new WeakMap
        );
      }
      current = this.get(current, path[i]);
    }
    const key = path[path.length - 1], cached = this.get(current, key);

    return cached || this.put(current, key, setter());
  }

  get(store, key) {
    if (store instanceof WeakMap) {
      return store.get(key);
    } else {
      return store[key];
    }
  }

  put(store, key, value) {
    if (store instanceof WeakMap) {
      store.set(key, value);
    } else {
      store[key] = value;
    }

    return value;
  }
}
