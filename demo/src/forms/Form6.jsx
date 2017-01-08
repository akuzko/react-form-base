import React from 'react';
import Form, { TextField } from '../form';

export default class Form6 extends Form {
  static title = 'Generic Validation';
  static description = `
    With no predefined validations, form's #performValidation method calls
    #validate method and uses it's return value to set form errors that
    will be passed to inputs on next rendering.

    In this example form validates it's inputs in following way:
    - firstName is always invalid
    - lastName is invalid in 50% of validations being run
    - street, which is nested under 'address' property is invalid if
      it doesn't start with 'A'
  `;
  static source = `
    // read about those setup components at the beginning of examples
    import Form, { TextField } from 'form';

    class Form6 extends Form {
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

      render() {
        const { attrs, errors } = this.props;

        return (
          <div>
            <TextField {...this.input('firstName')} placeholder="First Name" />
            <TextField {...this.input('lastName')} placeholder="Last Name" />
            <TextField {...this.input('address.street')} placeholder="Street (nested field)" />

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
          <Form6
            attrs={this.state.form}
            errors={this.state.errors}
            onChange={(form, errors) => this.setState({ form, errors })}
          />
        );
      }
    }
  `;

  validate() {
    const errors = {
      firstName: 'is always invalid'
    };

    if (Math.random() < 0.5) {
      errors['lastName'] = 'is invalid this time';
    }

    if (!/^A/.test(this.get('address.street'))) {
      errors['address.street'] = 'should begin with A';
    }

    return errors;
  }

  render() {
    const { attrs, errors } = this.props;

    return (
      <div>
        {this.renderExample()}

        <TextField {...this.input('firstName')} placeholder="First Name" />
        <TextField {...this.input('lastName')} placeholder="Last Name" />
        <TextField {...this.input('address.street')} placeholder="Street (nested field)" />

        <button onClick={this.performValidation.bind(this)}>Validate</button>
      </div>
    );
  }
}
