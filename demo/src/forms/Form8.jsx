import React from 'react';
import dedent from 'dedent-js';
import Form, { TextField } from '../form';

const SOURCE = [['BaseForm.jsx', `
  import Form from 'react-form-base';

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
`], ['ItemForm.jsx', `
  // read about those setup components at the beginning of examples
  import BaseForm, { TextField } from 'base-form';

  class ItemForm extends BaseForm {
    validations = {
      description: 'presence',
      amount: ['presence', function(value) {
        if (parseInt(value) % 5 != 0) return 'should be divisable by 5';
      }]
    };

    render() {
      return (
        <div>
          <TextField {...this.$('description')} placeholder="Description" />
          <TextField {...this.$('amount')} placeholder="Amount" />
        </div>
      );
    }
  }
`], ['Form8.jsx', `
  // read about those setup components at the beginning of examples
  import BaseForm, { TextField } from 'base-form';
  import ItemForm from './ItemForm';

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
`], ['Page.jsx', `
  import React, { Component } from 'react';
  import Form8 from './Form8';

  class Page extends Component {
    state = {
      form: {}
    };

    render() {
      return (
        <Form8
          attrs={this.state.form}
          onChange={(form) => this.setState({ form })}
          validateOnChange
        />
      );
    }
  }
`]];

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

  render() {
    return (
      <div className='flex-item mr-20'>
        <div className='mb-20'>
          <TextField className='form-control' {...this.$('description')} placeholder="Description" />
        </div>
        <TextField className='form-control' {...this.$('amount')} placeholder="Amount" />
      </div>
    );
  }
}

export default class Form8 extends BaseForm {
  static showErrors = true;
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
  static source = SOURCE;

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
    const deleteIcon = (
      <svg className='delete-icon' viewBox="0 0 44.2 44.2">
        <path d="M15.5 29.5c-0.2 0-0.4-0.1-0.5-0.2 -0.3-0.3-0.3-0.8 0-1.1l13.2-13.2c0.3-0.3 0.8-0.3 1.1 0s0.3 0.8 0 1.1L16.1 29.2C15.9 29.4 15.7 29.5 15.5 29.5z"/>
        <path d="M28.7 29.5c-0.2 0-0.4-0.1-0.5-0.2L15 16.1c-0.3-0.3-0.3-0.8 0-1.1s0.8-0.3 1.1 0l13.2 13.2c0.3 0.3 0.3 0.8 0 1.1C29.1 29.4 28.9 29.5 28.7 29.5z"/>
        <path d="M22.1 44.2C9.9 44.2 0 34.3 0 22.1 0 9.9 9.9 0 22.1 0S44.2 9.9 44.2 22.1 34.3 44.2 22.1 44.2zM22.1 1.5C10.8 1.5 1.5 10.8 1.5 22.1s9.3 20.6 20.6 20.6 20.6-9.2 20.6-20.6S33.5 1.5 22.1 1.5z"/>
      </svg>
    );

    return super.render(
      <div>
        <div className='mb-20'>
          <TextField className='form-control' {...this.input('email')} placeholder="Email" />
        </div>

        {this.mapExtraIn('items', (item, i) =>
          <div key={i}>
            <div className='mb-20'>
              <TextField className='form-control' {...this.$(`items.${i}.name`)} placeholder="Name" />
            </div>

            {this.get(`items.${i}.name`) &&
              <div className='horizontal-container center bordered-form-item mb-20'>
                <ItemForm
                  ref={`itemForm${i}`}
                  attrs={item}
                  onChange={(item) => this.merge(`items.${i}`, item)}
                  validateOnChange
                />
                <div className='pointer' onClick={() => this.spliceIn('items', i)}>
                  { deleteIcon }
                </div>
              </div>
            }
          </div>
        )}

        <div className='text-right'>
          <button className='btn green' onClick={this.performValidation.bind(this)}>Validate</button>
        </div>
      </div>
    );
  }
}
