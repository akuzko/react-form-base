import React from 'react';
import Form, { TextField, Select } from '../form';

const SOURCE = [['Form1.jsx', `
  // read about those setup components at the beginning of examples
  import Form, { TextField, Select } from 'form';

  class Form1 extends Form {
    render() {
      return (
        <div>
          <TextField {...this.$('firstName')} />
          <TextField {...this.$('lastName')} />
          <Select {...this.$('role')} options={['admin', 'employee']} includeBlank />
        </div>
      );
    }
  }
`]];

export default class Form1 extends Form {
  static title = 'Basic example';
  static description = 'Simplest example: a set of 3 simple form fields.';
  static source = SOURCE;

  render() {
    return super.render(
      <div>
        <TextField {...this.$('firstName')} placeholder="First Name" />
        <TextField {...this.$('lastName')} placeholder="Last Name" />
        <Select {...this.$('role')} options={['admin', 'employee']} includeBlank />
      </div>
    );
  }
}
