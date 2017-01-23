import React from 'react';
import dedent from 'dedent-js';
import Form, { TextField, Select } from '../form';

const SOURCE = [['Form2.jsx', `
  // read about those setup components at the beginning of examples
  import Form, { TextField, Select } from 'form';

  class Form2 extends Form {
    $render($) {
      return (
        <div>
          <TextField {...$('email')} placeholder="Email" />

          <Select {...$('address.country')} options={['Country 1', 'Country 2']} />
          <TextField {...$('address.city')} placeholder="City" />
          <TextField {...$('address.streetLine')} placeholder="Street Line" />
          <TextField {...$('address.zip')} placeholder="Zip" />
        </div>
      );
    }
  }
`]];

export default class Form2 extends Form {
  static title = 'Nested Attributes';
  static description = dedent`
    In this form our working object has \`email\` string property and \`address\`
    object with it's own properties all handled in one form.
  `;
  static source = SOURCE;

  $render($) {
    return (
      <div>
        <TextField {...$('email')} className="form-control mb-20" placeholder="Email" />

        <Select {...$('address.country')} className="form-control mb-20" options={['Country 1', 'Country 2']} includeBlank="Select Country..." />
        <TextField {...$('address.city')} className="form-control mb-20" placeholder="City" />
        <TextField {...$('address.streetLine')} className="form-control mb-20" placeholder="Street Line" />
        <TextField {...$('address.zip')} className="form-control mb-20" placeholder="Zip" />
      </div>
    );
  }
}
