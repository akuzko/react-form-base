import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';

export function handleChange(path, value) {
  return this.set(...[...path, value]);
}

export function fullPath(path) {
  return path.reduce(function(full, part) {
    return `${full}${isNumber(part) ? `[${part}]` : `${full ? '.' : ''}${part}`}`;
  }, '');
}

export function fullName(path) {
  return path.join('-');
}

export function isFormProperty(value) {
  return isObject(value) && value.hasOwnProperty('value') && value.hasOwnProperty('error');
}
