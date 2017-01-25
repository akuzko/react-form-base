import React from 'react';
import dedent from 'dedent-js';
import Form, { TextField } from '../form';

const SOURCE = [['Form7.jsx', `
  // read about those setup components at the beginning of examples
  import Form, { TextField } from 'form';

  class Form7 extends Form {
    validate() {
      const errors = {
        firstName: 'is always invalid'
      };

      if (Math.random() < 0.5) {
        errors.lastName = 'is invalid this time';
      }

      if (!/^A/.test(this.get('address.street'))) {
        errors['address.street'] = 'should begin with A';
      }

      return errors;
    }

    $render($) {
      return (
        <div>
          <TextField {...$('firstName')} placeholder="First Name" />
          <TextField {...$('lastName')} placeholder="Last Name" />
          <TextField {...$('address.street')} placeholder="Street (nested field)" />

          <button onClick={this.performValidation.bind(this)}>Validate</button>
        </div>
      );
    }
  }
`], ['Page.jsx', `
  import React, { Component } from 'react';
  import Form7 from './Form7';

  class Page extends Component {
    state = {
      form: {}
    };

    render() {
      return (
        <Form7 attrs={this.state.form} onChange={(form) => this.setState({ form })} />
      );
    }
  }
`]];

export default class Form7 extends Form {
  static showErrors = true;
  static title = 'Generic Validation';
  static description = dedent`
    With no predefined validations, form's \`#performValidation\` method calls
    \`#validate\` method and uses it's return value to set form errors that
    will be passed to inputs on next rendering.

    In this example form validates it's inputs in following way:
    - \`firstName\` is always invalid
    - \`lastName\` is invalid in 50% of validations being run
    - \`address.city\` should begin with capital letter
    - \`address.streetLine\` should contain letters and end with digits
  `;
  static source = SOURCE;

  validate() {
    const errors = {
      firstName: 'is always invalid'
    };

    if (Math.random() < 0.5) {
      errors['lastName'] = 'is invalid this time';
    }

    if (!/^[A-Z]/.test(this.get('address.city'))) {
      errors['address.city'] = 'should begin with capital letter';
    }

    if (!/^[\w\s]+\s\d+$/.test(this.get('address.streetLine'))) {
      errors['address.streetLine'] = 'contain letters and end with digits';
    }

    return errors;
  }

  $render($) {
    return (
      <div>
        <div className="mb-20">
          <TextField {...$('firstName')} className="form-control" placeholder="First Name" />
        </div>
        <div className="mb-20">
          <TextField {...$('lastName')} className="form-control" placeholder="Last Name" />
        </div>
        <div className="mb-20">
          <TextField {...$('address.city')} className="form-control" placeholder="Address/City" />
        </div>
        <div className="mb-20">
          <TextField {...$('address.streetLine')} className="form-control" placeholder="Address/Street" />
        </div>

        <div className="text-right">
          <button className="btn green" onClick={this.performValidation.bind(this)}>Validate</button>
        </div>
      </div>
    );
  }
}
