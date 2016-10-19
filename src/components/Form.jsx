import React, { PropTypes, Component } from 'react';

import { handleChange, fullPath, fullName } from '../utils';
import isObject from 'lodash/isObject';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import noop from 'lodash/noop';

export default class Form extends Component {
  static propTypes = {
    attrs: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    onRequestSave: PropTypes.func
  };

  static defaultProps = {
    onChange: noop,
    onRequestSave: noop
  };

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

  get(...path) {
    return get(this.props.attrs, fullPath(path), '');
  }

  set(...path) {
    const newAttrs = cloneDeep(this.props.attrs);

    if (isObject(path[0])) {
      for (const key of path[0]) {
        set(newAttrs, key, path[0][key]);
      }
    } else {
      const value = path.pop();
      const name = fullPath(path);

      set(newAttrs, name, value)
    }

    return this.props.onChange(newAttrs);
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
    const errors = this.props.attrs.errors || {};
    if (!path.length) return errors;
    return errors[fullName(path)];
  }

  render() {
    return null;
  }
};
