import React from 'react';
import Form from '../../src';
import Input from './Input';

export default class DemoForm extends Form {
  static validations = {
    presence(value) { if (!value) return 'cannot be blank'; },
    email(value) { if (!/^[\w\d\.]+@[\w\d\.]+$/.test(value)) return 'should be email'; }
  };

  validations = {
    foo: ['presence', 'email']
  };

  render() {
    return (
      <Input {...this.$('foo')} />
    );
  }
}
