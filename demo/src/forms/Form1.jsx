import React from 'react';
import Form, { TextField, Select } from '../form';

const SOURCE = [['Form1.jsx', `
  // read about those setup components at the beginning of examples
  import Form, { TextField, Select } from 'form';

  class Form1 extends Form {
    $render($) {
      return (
        <div>
          <TextField {...$('firstName')} />
          <TextField {...$('lastName')} />
          <Select {...$('role')} options={['admin', 'employee']} includeBlank="Select Role..." />
        </div>
      );
    }
  }
`]];

export default class Form1 extends Form {
  static title = 'Basic example';
  static description = 'Simplest example: a set of 3 simple form fields.';
  static source = SOURCE;

  $render($) {
    return (
      <div>
        <TextField className="form-control mb-20" {...$('firstName')} placeholder="First Name" />
        <TextField className="form-control mb-20" {...$('lastName')} placeholder="Last Name" />
        <Select className="form-control mb-20" {...$('role')} options={['admin', 'employee']} includeBlank="Select Role..." />
      </div>
    );
  }
}
