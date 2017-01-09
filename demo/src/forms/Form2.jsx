import React from 'react';
import dedent from 'dedent-js';
import Form, { TextField } from '../form';

export default class Form2 extends Form {
  static title = 'Usage of custom onChange handler';
  static description = dedent`
    This form uses custom onChange handler (named \`$lastName\`) for 'lastName'
    field changes.
  `;
  static source = `
    // read about those setup components at the beginning of examples
    import Form, { TextField } from 'form';

    class Form2 extends Form {
      $lastName(value) {
        return this.set('lastName', value.toUpperCase());
      }

      render() {
        return (
          <div>
            <TextField {...this.$('firstName')} />
            <TextField {...this.$('lastName')(this.$lastName)} />
          </div>
        );
      }
    }
  `;

  $lastName(value) {
    return this.set('lastName', value.toUpperCase());
  }

  render() {
    return (
      <div>
        {this.renderExample()}

        <TextField {...this.$('firstName')} placeholder="First Name" />
        <TextField {...this.$('lastName')(this.$lastName)} placeholder="Last Name" />
      </div>
    );
  }
}
