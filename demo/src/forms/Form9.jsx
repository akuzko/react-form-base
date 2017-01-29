import React from 'react';
import dedent from 'dedent-js';
import Form, { TextField } from '../form';

const SOURCE = [['Form9.jsx', `
  // read about those setup components at the beginning of examples
  import Form, { TextField } from 'form';

  class Form9 extends Form {
    static validations = {
      presence: function(value) {
        if (!value) return 'cannot be blank';
      },
      numericality: function(value) {
        if (value && isNaN(parseFloat(value))) {
          return 'should be a number';
        }
      }
    };

    validations = {
      'fullName': 'presence',
      'numbers.*': 'numericality'
    };

    validate($v) {
      $v('fullName');
      this.each('numbers', (_n, i) => {
        $v(\`numbers.\${i}\`);
      });

      return $v.errors;
    }

    $number(i, value) {
      if (value) {
        return this.set(\`numbers.\${i}\`, value);
      } else {
        return this.remove('numbers', i);
      }
    }

    $render($) {
      return (
        <div>
          <TextField {...$('fullName')} placeholder="Full Name" />

          {this.mapExtra('numbers', (_value, i) =>
            <TextField
              key={i}
              {...$(\`numbers.\${i}\`)(this.$number, i)}
              placeholder={\`Number \${i + 1}\`}
            />
          )}

          <button onClick={this.performValidation.bind(this)}>Validate</button>
        </div>
      );
    }
  }
`], ['Page.jsx', `
  import React, { Component } from 'react';
  import Form9 from './Form9';

  class Page extends Component {
    state = {
      form: {}
    };

    render() {
      return (
        <Form9
          attrs={this.state.form}
          onChange={(form) => this.setState({ form })}
          validateOnChange
        />
      );
    }
  }
`]];

const DESCRIPTION = dedent`
  In this example Form has been set up in a way similar to [Form5](#form05), i.e.
  it has auto-add and auto-remove items behavior. The difference is that each item
  in the collection is supposed to be a string that represents a number.

  For validating item in a collection, wildcard validation key is used:
  \`'numbers.*': 'numericality'\`. During validation process, form iterates over
  it's items and calls input validation upon each item. Thus, inputs with names
  like \`'numbers.0'\`, \`'numbers.1'\` and so on will be validated with rules
  defined for \`'numbers.*'\`.

  **NOTE:** wildcard validation is not limited to a string values. Your form
  may have a collection of nested _objects_ any you may want to define property
  validation for each of them with something like

  \`\`\`js
    validations = {
      'email': 'presence',
      'items.*.name: 'presence',
      'items.*.amount': 'numericality'
    };
  \`\`\`
`;

export default class Form9 extends Form {
  static showErrors = true;
  static title = 'Validating collection items using Wildcards';
  static description = DESCRIPTION;
  static source = SOURCE;

  static validations = {
    presence: function(value) {
      if (!value) return 'cannot be blank';
    },
    numericality: function(value) {
      if (value && isNaN(parseFloat(value))) {
        return 'should be a number';
      }
    }
  };

  validations = {
    'fullName': 'presence',
    'numbers.*': 'numericality'
  };

  validate($v) {
    $v('fullName');
    this.each('numbers', (_n, i) => {
      $v(`numbers.${i}`);
    });

    return $v.errors;
  }

  $number(i, value) {
    if (value) {
      return this.set(`numbers.${i}`, value);
    } else {
      return this.remove('numbers', i);
    }
  }

  $render($) {
    return (
      <div>
        <div className="mb-20">
          <TextField {...$('fullName')} className="form-control" placeholder="Full Name" />
        </div>

        {this.mapExtra('numbers', (_value, i) =>
          <div key={i} className="mb-20">
            <TextField
              {...$(`numbers.${i}`)(this.$number, i)}
              className="form-control"
              placeholder={`Number ${i + 1}`}
            />
          </div>
        )}
        <div className="text-right">
          <button className="btn green" onClick={this.performValidation.bind(this)}>Validate</button>
        </div>
      </div>
    );
  }
}
