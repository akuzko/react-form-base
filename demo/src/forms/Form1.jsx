import React from 'react';
import Form from './ApplicationForm';
import { Input, Select } from '../inputs';

export default class Form1 extends Form {
  static title = 'Basic example';
  static description = 'Simplest example: a set of 3 simple form fields.';
  static source = `
    // read about those setup components at the beginning of README
    import Form, { Input, Select } from 'form';

    class Form1 extends Form {
      render() {
        return (
          <div>
            <Input {...this.$('firstName')} />
            <Input {...this.$('lastName')} />
            <Select {...this.$('role')} options={['admin', 'employee']} includeBlank />
          </div>
        );
      }
    }
  `;

  render() {
    return (
      <div>
        {this.renderExample()}

        <Input {...this.$('firstName')} placeholder="First Name" />
        <Input {...this.$('lastName')} placeholder="Last Name" />
        <Select {...this.$('role')} options={['admin', 'employee']} includeBlank />
      </div>
    );
  }
}
