import React from 'react';
import dedent from 'dedent-js';
import Form, { TextField } from '../form';

const SOURCE = [['Form3.jsx', `
  // read about those setup components at the beginning of examples
  import Form, { TextField } from 'form';

  class Form3 extends Form {
    $lastName(value) {
      return this.set('lastName', value.toUpperCase());
    }

    $render($) {
      return (
        <div>
          <TextField {...$('firstName')} placeholder="First Name" />
          <TextField {...$('lastName')(this.$lastName)} placeholder="Last Name" />
        </div>
      );
    }
  }
`]];

export default class Form3 extends Form {
  static title = 'Usage of custom onChange handler';
  static description = dedent`
    This form uses custom onChange handler (named \`$lastName\`) for \`'lastName'\`
    field changes.
  `;
  static source = SOURCE;

  $lastName(value) {
    return this.set('lastName', value.toUpperCase());
  }

  $render($) {
    return (
      <div>
        <TextField {...$('firstName')} placeholder="First Name" className="form-control mb-20" />
        <TextField {...$('lastName')(this.$lastName)} placeholder="Last Name" className="form-control mb-20" />
      </div>
    );
  }
}
