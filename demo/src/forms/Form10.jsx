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
      name: 'presence',
      description: 'presence',
      amount: ['presence', function(value) {
        if (+value % 5 != 0) return 'should be divisable by 5';
      }]
    };

    $render($) {
      return (
        <div>
          <TextField {...$('name')} placeholder="Item Name" />
          <TextField {...$('description')} placeholder="Item Description" />
          <TextField {...$('amount')} placeholder="Item Amount" />
        </div>
      );
    }
  }
`], ['Form10.jsx', `
  // read about those setup components at the beginning of examples
  import BaseForm, { TextField } from 'base-form';
  import ItemForm from './ItemForm';

  class Form10 extends Form {
    validations = {
      'email': ['presence', 'email'],
      'items': function(value) {
        if (!value || value.length === 0) {
          return 'should have at least one item';
        }
      }
    };

    validate($v) {
      $v('email');
      $v('items');
      this.each('items', (_item, i) => {
        $v.nested(\`itemForm\${i}\`);
      });

      return $v.errors;
    }

    $render($) {
      return (
        <div>
          <TextField {...$('email')} placeholder="Email" />

          {this.getError('items') &&
            <div className="error">{this.getError('items')}</div>
          }

          {this.map('items', (_item, i) =>
            <div key={i}>
              <ItemForm
                ref={\`itemForm\${i}\`}
                {...$.nested(\`items.\${i}\`)}
                validateOnChange
              />
              <button onClick={() => this.remove('items', i)}>X</button>
            </div>
          )}

          <button onClick={() => this.push('items', {})}>Add Item</button>
          <button onClick={this.performValidation.bind(this)}>Validate</button>
        </div>
      );
    }
  }
`], ['Page.jsx', `
  import React, { Component } from 'react';
  import Form10 from './Form10';

  class Page extends Component {
    state = {
      form: {}
    };

    render() {
      return (
        <Form10
          attrs={this.state.form}
          onChange={(form) => this.setState({ form })}
          validateOnChange
        />
      );
    }
  }
`]];

const DESCRIPTION = dedent`
  In this example top-level form uses nested \`ItemForm\`s for managing a list
  of nested items. Each nested form has it's own validations set up in
  \`ItemForm\`. During validation, top-level form iterates over created
  forms and triggers their validation routies. Beside that, main form validates
  it's own \`email\` field and presence of at least one item.
`;

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
    name: 'presence',
    description: 'presence',
    amount: ['presence', function(value) {
      if (+value % 5 != 0) return 'should be divisable by 5';
    }]
  };

  $render($) {
    return (
      <div className="flex-item mr-20">
        <div className="mb-20">
          <TextField {...$('name')} className="form-control" placeholder="Item Name" />
        </div>
        <div className="mb-20">
          <TextField {...$('description')} className="form-control" placeholder="Item Description" />
        </div>
        <TextField {...$('amount')} className="form-control" placeholder="Item Amount" />
      </div>
    );
  }
}

export default class Form10 extends BaseForm {
  static showErrors = true;
  static title = 'Validation of nested forms';
  static description = DESCRIPTION;
  static source = SOURCE;

  validations = {
    'email': ['presence', 'email'],
    'items': function(value) {
      if (!value || value.length === 0) {
        return 'should have at least one item';
      }
    }
  };

  validate($v) {
    $v('email');
    $v('items');
    this.each('items', (_item, i) => {
      $v.nested(`itemForm${i}`);
    });

    return $v.errors;
  }

  $render($) {
    const deleteIcon = (
      <svg className="delete-icon" viewBox="0 0 44.2 44.2">
        <path d="M15.5 29.5c-0.2 0-0.4-0.1-0.5-0.2 -0.3-0.3-0.3-0.8 0-1.1l13.2-13.2c0.3-0.3 0.8-0.3 1.1 0s0.3 0.8 0 1.1L16.1 29.2C15.9 29.4 15.7 29.5 15.5 29.5z" />
        <path d="M28.7 29.5c-0.2 0-0.4-0.1-0.5-0.2L15 16.1c-0.3-0.3-0.3-0.8 0-1.1s0.8-0.3 1.1 0l13.2 13.2c0.3 0.3 0.3 0.8 0 1.1C29.1 29.4 28.9 29.5 28.7 29.5z" />
        <path d="M22.1 44.2C9.9 44.2 0 34.3 0 22.1 0 9.9 9.9 0 22.1 0S44.2 9.9 44.2 22.1 34.3 44.2 22.1 44.2zM22.1 1.5C10.8 1.5 1.5 10.8 1.5 22.1s9.3 20.6 20.6 20.6 20.6-9.2 20.6-20.6S33.5 1.5 22.1 1.5z" />
      </svg>
    );

    return (
      <div>
        <div className="mb-20">
          <TextField {...$('email')} className="form-control" placeholder="Email" />
        </div>

        {this.getError('items') &&
          <div className="error">{this.getError('items')}</div>
        }

        {this.map('items', (_item, i) =>
          <div key={i} className="horizontal-container center bordered-form-item mb-20">
            <ItemForm
              ref={`itemForm${i}`}
              {...$.nested(`items.${i}`)}
              validateOnChange
            />
            <div className="pointer" onClick={() => this.remove('items', i)}>
              {deleteIcon}
            </div>
          </div>
        )}

        <div className="text-right">
          <button className="btn green mr-20" onClick={() => this.push('items', {})}>Add Item</button>
          <button className="btn green" onClick={this.performValidation.bind(this)}>Validate</button>
        </div>
      </div>
    );
  }
}
