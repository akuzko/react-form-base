import React from 'react';
import Form from '../../src';
import Input from './Input';

export default class DemoForm extends Form {
  static validations = {
    presence(value) { if (!value) return 'cannot be blank'; },
    email(value) { if (value && !/^[\w\d\.]+@[\w\d\.]+$/.test(value)) return 'should be email'; }
  };

  validations = {
    foo: ['presence', 'email']
  };

  render() {
    return (
      <div>
        <Input {...this.$('foo')} />
        {this.mapExtraIn('bars', (i) =>
          <Input key={i} {...this.$(['bars', i, 'baz'])} />
        )}
      </div>
    );
  }
}
