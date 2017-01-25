import React from 'react';
import dedent from 'dedent-js';
import Form, { TextField } from '../form';

const SOURCE = [['Form5.jsx', `
  import Form, { TextField } from 'form';

  class Form5 extends Form {
    $language(i, value) {
      if (value) {
        return this.set(\`favoriteLanguages.\${i}\`, value);
      } else {
        return this.spliceIn('favoriteLanguages', i);
      }
    }

    $render($) {
      return (
        <div>
          <TextField {...$('fullName')} placeholder="Full Name" />
          {this.mapExtraIn('favoriteLanguages', (_value, i) =>
            <TextField
              key={i}
              {...$(\`favoriteLanguages.\${i}\`)(this.$language, i)}
              placeholder={ \`Language \${i + 1}\` }
            />
          )}
        </div>
      );
    }
  }
`]];

export default class Form5 extends Form {
  static title = 'Auto-add and auto-remove inputs on value change';
  static description = dedent`
    This form has a standard \`'fullName'\` input for a person's name and a number
    (at least one) of inputs for \`'favoriteLanguages'\` values. Whenever new value
    is entered, additional input will appear. Also, whenever value is erased,
    it's input gets removed. To achieve this behavior two helper methods were
    used: \`mapExtraIn\` when rendering, and \`spliceIn\` in onChange handler.
  `;
  static source = SOURCE;

  $language(i, value) {
    if (value) {
      return this.set(`favoriteLanguages.${i}`, value);
    } else {
      return this.spliceIn('favoriteLanguages', i);
    }
  }

  $render($) {
    return (
      <div>
        <TextField {...$('fullName')} className="form-control mb-20" placeholder="Full Name" />

        <div className="bordered-form-item">
          {this.mapExtraIn('favoriteLanguages', (_value, i) =>
            <TextField key={i} {...$(`favoriteLanguages.${i}`)(this.$language, i)} className="form-control mb-20" placeholder={ `Language ${i + 1}` } />
          )}
        </div>
      </div>
    );
  }
}
