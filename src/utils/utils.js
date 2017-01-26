import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

export function fullPath(path) {
  return path.map((part, i) => isNumber(part) ? `[${part}]` : (i > 0 ? '.' : '') + part).join('');
}

export function fullName(path) {
  return path.join('.');
}

export function pathToName(path) {
  return path.replace(/\[(\d+)\]/g, (_match, i) => `.${i}`);
}

export function nameToPath(name) {
  return name.replace(/\.(\d+)(\.)?/g, (_match, i, dot) => `[${i}]` + (dot ? '.' : ''));
}

function wildcard(name) {
  return name.replace(/\d+/g, '*');
}

export function buildFormValidator(form) {
  function validate(...args) {
    let options = {};
    if (isObject(args[args.length - 1])) {
      options = args.pop();
    }
    const { with: validateWith, value: validateValue } = options;
    const name = fullName(args);
    const value = typeof validateValue !== 'undefined' ? validateValue : form.get(...args);
    const validator = validateWith || form.validations[name] || form.validations[wildcard(name)];

    if (!validator) return null;

    const error = callValidator(validator);

    if (error) {
      return validate.addError(name, error);
    }

    return null;

    function callValidator(validator) {
      if (isPlainObject(validator)) {
        return callObjectValidator(validator);
      }
      if (isArray(validator)) {
        return callArrayValidator(validator);
      }
      if (typeof validator === 'string') {
        return callStringValidator(validator);
      }
      if (typeof validator === 'function') {
        return validator.call(form, value);
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
