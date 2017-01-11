import React from 'react';
import dedent from 'dedent-js';
import Form, { TextField } from '../form';

class BaseForm extends Form {
  static validations = {
    presence(value) { if (!value) return 'cannot be blank'; },
    email(value) {
      if (value && !/^[\w\d\.]+@[\w\d]+\.[\w\d]{2,}$/.test(value)) {
        return 'should be email';
      }
    }
  };
}

export default class Form8 extends BaseForm {
  static title = 'Complex Validation Example';
  static description = dedent`
    This example shows complex validation usage example which includes
    special input validator function (described bellow), nested form validation,
    usage of wildcards, special form handlers and case-specific validation that
    is too case-specific to be defined as generic validation rule.

    Form's \`#validate\` method accepts a special input validator function
    that can be used to iterate over arbitrary amount of inputs and
    validate them according to validation rules. It's first argument is a
    full name of the input being validated. The second optional argument
    should be an object that has a \`'with'\` property with a value of validation
    rule (string, function or array). This function has an \`'errors'\` property
    whish should be a return value of your \`#validate\` method.
  `;
  static source = `
    // read about those setup components at the beginning of examples
    import Form, { TextField, Select } from 'form';

    class BaseForm extends Form {
      static validations = {
        presence(value) { if (!value) return 'cannot be blank'; },
        email(value) {
          if (value && !/^[\w\d\.]+@[\w\d]+\.[\w\d]{2,}$/.test(value)) {
            return 'should be email';
          }
        }
      };
    }

    class ItemForm extends BaseForm {
      validations = {
        description: 'presence',
        amount: ['presence', function(value) {
          if (parseInt(value) % 5 != 0) return 'should be divisable by 5';
        }]
      };

      getValidationErrors() {
        const errs = super.getValidationErrors();
        return errs;
      }

      render() {
        return (
          <div>
            <TextField {...this.$('description')} placeholder="Description" />
            <TextField {...this.$('amount')} placeholder="Amount" />
          </div>
        );
      }
    }

    class Form8 extends Form {
      validations = {
        'items.*.name': 'presence'
      };

      validate(validate) {
        validate('email', { with: 'email' });
        // ^- just for demostration, it would be better to define email validation
        //    on form level and simply call \`validate('email');\` here

        this.eachIndexIn('items', (i) => {
          validate(\`items.\${i}.name\`);
          // ^- uses wildcard defined in form

          validate.nested(\`itemForm\${i}\`);
        });

        return validate.errors;
      }

      render() {
        return (
          <div>
            {this.renderExample()}

            <TextField {...this.input('email')} placeholder="Email" />

            {this.mapExtraIn('items', (item, i) =>
              <div key={i}>
                <TextField {...this.$(\`items.\${i}.name\`)} placeholder="Name" />

                {this.get(\`items.\${i}.name\`) &&
                  <div>
                    <ItemForm
                      ref={\`itemForm\${i}\`}
                      attrs={item}
                      onChange={(item) => this.merge(\`items.\${i}\`, item)}
                      validateOnChange
                    />
                    <button onClick={() => this.spliceIn('items', i)}>X</button>
                  </div>
                }
              </div>
            )}

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
    'items.*.name': 'presence'
  };

  validate(validate) {
    validate('email', { with: 'email' });
    // ^- just for demostration, it would be better to define email validation
    //    on form level and simply call `validate('email');` here

    this.eachIndexIn('items', (i) => {
      validate(`items.${i}.name`);
      // ^- uses wildcard defined in form

      validate.nested(`itemForm${i}`);
    });

    return validate.errors;
  }

  render() {
    return (
      <div>
        {this.renderExample()}

        <TextField {...this.input('email')} placeholder="Email" />

        {this.mapExtraIn('items', (item, i) =>
          <div key={i}>
            <TextField {...this.$(`items.${i}.name`)} placeholder="Name" />

            {this.get(`items.${i}.name`) &&
              <div>
                <ItemForm
                  ref={`itemForm${i}`}
                  attrs={item}
                  onChange={(item) => this.merge(`items.${i}`, item)}
                  validateOnChange
                />
                <button onClick={() => this.spliceIn('items', i)}>X</button>
              </div>
            }
          </div>
        )}

        <button onClick={this.performValidation.bind(this)}>Validate</button>
      </div>
    );
  }
}

class ItemForm extends BaseForm {
  validations = {
    description: 'presence',
    amount: ['presence', function(value) {
      if (parseInt(value) % 5 != 0) return 'should be divisable by 5';
    }]
  };

  getValidationErrors() {
    const errs = super.getValidationErrors();
    return errs;
  }

  render() {
    return (
      <div>
        <TextField {...this.$('description')} placeholder="Description" />
        <TextField {...this.$('amount')} placeholder="Amount" />
      </div>
    );
  }
}
