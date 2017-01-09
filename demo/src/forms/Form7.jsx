import React from 'react';
import dedent from 'dedent-js';
import Form, { TextField } from '../form';

export default class Form7 extends Form {
  static title = 'Predefined Validation';
  static description = dedent`
    In this example form defines simple validation rules as Form's static
    'validatations' property which are used in instance-specific 'validations'
    property defined on form's prototype. Note that validation rules (static
    validations property) is intended to be defined only once in your top-level
    application form.

    This example uses 'presence' and 'email' (defined very simply for demonstration
    purposes) validations to validate it's 'email' input. Also, there is
    numericality validation defined for 'amount' input. The later shows
    how you can pass custom options to validation rules.

    Also note that with predefined validations \`'validateOnChange'\` property may
    take place, which is enabled for the form in this example.
  `;
  static source = `
    // read about those setup components at the beginning of examples
    import Form, { TextField, Select } from 'form';

    class Form7 extends Form {
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
          if (typeof greaterThan != undefined && +value <= greaterThan) return \`should be greater than \${greaterThan}\`;
        }
      };

      validations = {
        email: ['presence', 'email'],
        amount: { presence: true, numericality: { greaterThan: 10 } }
      };

      render() {
        const { attrs, errors } = this.props;

        return (
          <div>
            <TextField {...this.input('email')} placeholder="Email" />
            <TextField {...this.input('amount')} placeholder="Amount" />
            <button onClick={this.performValidation.bind(this)}>Validate</button>
          </div>
        );
      }
    }

    class Container extends Component {
      state = {
        form: {}
      };

      render() {
        return (
          <Form7
            attrs={this.state.form}
            errors={this.state.errors}
            onChange={(form, errors) => this.setState({ form, errors })}
            validateOnChange
          />
        );
      }
    }
  `;

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
      if (typeof greaterThan != undefined && +value <= greaterThan) return `should be greater than ${greaterThan}`;
    }
  };

  validations = {
    email: ['presence', 'email'],
    amount: { presence: true, numericality: { greaterThan: 10 } }
  };

  render() {
    const { attrs, errors } = this.props;

    return (
      <div>
        {this.renderExample()}

        <TextField {...this.input('email')} placeholder="Email" />
        <TextField {...this.input('amount')} placeholder="Amount" />
        <button onClick={this.performValidation.bind(this)}>Validate</button>
      </div>
    );
  }
}
