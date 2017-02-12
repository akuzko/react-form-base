import React from 'react';
import dedent from 'dedent-js';
import Form, { TextField } from '../form';

const SOURCE = [['Form11.jsx', `
  // read about those setup components at the beginning of examples
  import BaseForm, { TextField } from 'base-form';

  class Form11 extends Form {
    static validations = {
      presence: function(value) {
        if (!value) return 'cannot be blank';
      }
    };

    validations = {
      'account': 'presence',
      'fullName': 'presence'
    };

    state = { saving: false };

    $render($) {
      const { saving, success } = this.state;

      return (
        <div>
          <TextField {...$('account')} placeholder="Account Name" />
          <TextField {...$('fullName')} placeholder="Full Name" />

          <div>
            {saving && 'Saving. Please wait 3 seconds...'}
            {success && 'Data has been successfully saved'}
          </div>

          <button onClick={() => this.save()}>Save</button>
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

    saveForm(data, form) {
      form.ifValid(() => {
        // simulated AJAX request
        return new Promise((resolve, reject) => {
          form.setState({ saving: true, success: false });
          setTimeout(() => {
            if (['foo', 'bar', 'baz'].includes(data.account)) {
              reject({ account: 'has already been taken' });
            } else {
              resolve(true);
            }
          }, 3000);
        }).then(success => form.setState({ success, saving: false }))
          .catch(errors => form.setState({ errors, saving: false }));
      });
    }

    render() {
      return (
        <Form9
          attrs={this.state.form}
          onChange={(form) => this.setState({ form })}
          onRequestSave={() => this.saveForm()}
          validateOnChange
        />
      );
    }
  }
`]];

const DESCRIPTION = dedent`
  In this example \`Form\` has **client-side** presence validation for \`'account'\`
  and \`'fullName'\` attributes. Then, when 'Save' button is clicked, Form container,
  \`Page\`, uses form's \`ifValid\` helper to validate a form and execute a callback
  if the form is valid. In this callback, AJAX request is mocked by wrapping
  timeouted function in a Promise. If account name is in \`['foo', 'bar', 'baz']\`
  promise will be rejected with \`{ account: 'has already been taken' }\` error.
  All other data is considered to be valid.

  **NOTE:** in this examples errors are set using \`setState\` method, since
  additional state property has to be set with it. If there are only errors to
  be set within the form, you may want to use \`form.setErrors(errors)\` call.
`;

export default class Form11 extends Form {
  static showErrors = true;
  static title = 'Accepting server-side errors';
  static description = DESCRIPTION;
  static source = SOURCE;

  static validations = {
    presence: function(value) {
      if (!value) return 'cannot be blank';
    }
  };

  validations = {
    'account': 'presence',
    'fullName': 'presence'
  };

  state = { saving: false };

  $render($) {
    const { saving, success } = this.state;

    return (
      <div>
        <div className="mb-20">
          <TextField {...$('account')} className="form-control" placeholder="Account Name" />
        </div>

        <div className="mb-20">
          <TextField {...$('fullName')} className="form-control" placeholder="Full Name" />
        </div>

        <div className="mb-20">
          {saving && 'Saving. Please wait 3 seconds...'}
          {success && 'Data has been successfully saved'}
        </div>

        <div className="text-right">
          <button className="btn green" onClick={() => this.save()}>Save</button>
        </div>
      </div>
    );
  }
}
