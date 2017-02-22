import React from 'react';
import dedent from 'dedent-js';
import Form, { TextField } from '../form';

const SOURCE = [['BaseForm.jsx', `
  import Form from 'react-form-base';

  class BaseForm extends Form {
    static validations = {
      presence(value) { if (!value) return 'cannot be blank'; },
      email(value) {
        if (value && !/^[\\w\\d\.]+@[\\w\\d]+\.[\\w\\d]{2,}$/.test(value)) {
          return 'should be email';
        }
      },
      numericality(value, options = {}) {
        const { greaterThan } = options;

        if (!value) return null;
        if (isNaN(+value)) return 'should be a number';
        if (typeof greaterThan != 'undefined' && +value <= greaterThan) {
          return \`should be greater than \${greaterThan}\`;
        }
      }
    };
  }
`], ['Form8.jsx', `
  // read about those setup components at the beginning of examples
  import BaseForm, { TextField } from 'base-form';

  class Form8 extends BaseForm {
    validations = {
      email: ['presence', 'email'],
      amount: { presence: true, numericality: { greaterThan: 10 } }
    };

    $render($) {
      return (
        <div>
          <TextField {...$('email')} placeholder="Email" />
          <TextField {...$('amount')} placeholder="Amount" />

          <button onClick={() => this.performValidation()}>Validate</button>
        </div>
      );
    }
  }
`], ['Page.jsx', `
  import React, { Component } from 'react';
  import { bindState } from 'react-form-base';
  import Form8 from './Form8';

  class Page extends Component {
    render() {
      return <Form8 {...bindState(this)} />;
    }
  }
`]];

export default class Form8 extends Form {
  static showErrors = true;
  static title = 'Predefined Validation (Recommended)';
  static description = dedent`
    In this example form defines simple validation rules as Form's \`static
    validatations\` property which are used in instance-specific \`validations\`
    property defined on form instance. Note that validation rules (static
    validations property) are intended to be defined only once in your top-level
    application form.

    This example uses \`'presence'\` and \`'email'\` (defined very simply for
    demonstration purposes) validations to validate it's 'email' input. Also,
    there is numericality validation defined for 'amount' input. The later shows
    how you can pass custom options to validation rules.

    Also note that with predefined validations \`validateOnChange\` property may
    take place, which is enabled by default, but can be disabled by passing
    \`false\` value in props.
  `;
  static source = SOURCE;

  static validations = {
    presence(value) { if (!value) return 'cannot be blank'; },
    email(value) {
      if (value && !/^[\w\d\.]+@[\w\d]+\.[\w\d]{2,}$/.test(value)) {
        return 'should be email';
      }
    },
    numericality(value, options = {}) {
      const { greaterThan } = options;

      if (!value) return null;
      if (isNaN(+value)) return 'should be a number';
      if (typeof greaterThan != 'undefined' && +value <= greaterThan) {
        return `should be greater than ${greaterThan}`;
      }
    }
  };

  validations = {
    email: ['presence', 'email'],
    amount: { presence: true, numericality: { greaterThan: 10 } }
  };

  $render($) {
    return (
      <div>
        <div className="mb-20">
          <TextField {...$('email')} className="form-control" placeholder="Email" />
        </div>
        <div className="mb-20">
          <TextField {...$('amount')} className="form-control" placeholder="Amount" />
        </div>
        <div className="text-right">
          <button className="btn green" onClick={() => this.performValidation()}>Validate</button>
        </div>
      </div>
    );
  }
}
