import React from 'react';
import Form from './ApplicationForm';
import Input from '../inputs/Input';

export default class Form7 extends Form {
  static title = 'Predefined Validation';
  static description = `
    In this example form defines simple validation rules as Form's static
    'validatations' property which are used in instance-specific 'validations'
    property defined on form's prototype. Note that validation rules (static
    validations property) is intended to be defined only once in your top-level
    application form.

    This example uses 'presence' and 'email' (defined very simply for demonstration
    purposes) validations  to validate it's only input. Also note that with
    predefined validations 'validateOnChange' property may take place, which is
    enabled for the form in this example.
  `;
  static source = `
    // read about those setup components at the beginning of README
    import Form, { Input, Select } from 'form';

    class Form7 extends Form {
      static validations = {
        presence(value) { if (!value) return 'cannot be blank'; },
        email(value) {
          if (value && !/^[\w\d\.]+@[\w\d]+\.[\w\d]{2,}$/.test(value)) {
            return 'should be email';
          }
        }
      };

      validations = {
        email: ['presence', 'email']
      };

      render() {
        const { attrs, errors } = this.props;

        return (
          <div>
            <Input {...this.input('email')} placeholder="Email" />
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

  validations = {
    email: ['presence', 'email']
  };

  render() {
    const { attrs, errors } = this.props;

    return (
      <div>
        {this.renderExample()}

        <Input {...this.input('email')} placeholder="Email" />
        <button onClick={this.performValidation.bind(this)}>Validate</button>
      </div>
    );
  }
}
