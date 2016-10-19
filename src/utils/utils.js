import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';

export function handleChange(path, value) {
  return this.set(...[...path, value]);
}

export function fullPath(path) {
  return path.map((part, i) => isNumber(part) ? `[${part}]` : (i > 0 ? '.' : '') + part).join('');
}

export function fullName(path) {
  return path.join('.');
}

export function addErrors(attrs, errors) {
  Object.defineProperty(attrs, 'errors', {
    value: errors,
    enumerable: false
  });
  return attrs;
}
