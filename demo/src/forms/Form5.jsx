import React from 'react';
import dedent from 'dedent-js';
import Form, { TextField, Select } from '../form';

class ItemForm extends Form {
  render() {
    return (
      <div>
        <Select {...this.input('amount')} options={[10, 50, 100]} includeBlank />
        <TextField {...this.input('comment')} placeholder="Comment" />
      </div>
    );
  }
}

export default class Form5 extends Form {
  static title = 'Nested Forms';
  static description = dedent`
    This example shows how top-level form can use nested forms to render and
    manipulate single set of attributes.

    In this example, top-level form uses \`mapIn\`, \`pushIn\` and \`spliceIn\`
    helper methods to iterate over it's items for rendering subforms, dynamically
    add and remove items.
  `;
  static source = `
    // read about those setup components at the beginning of examples
    import Form, { TextField, Select } from 'form';

    class ItemForm extends Form {
      render() {
        return (
          <div>
            <Select {...this.input('amount')} options={[10, 50, 100]} includeBlank />
            <TextField {...this.input('comment')} placeholder="Comment" />
          </div>
        );
      }
    }

    class Form5 extends Form {
      render() {
        return (
          <div>
            <TextField {...this.$('firstName')} placeholder="Full Name" />

            {this.mapIn('items', (item, i) =>
              <div key={i}>
                <ItemForm attrs={item} onChange={(form) => this.merge(\`items.\${i}\`, form)} />
                <button onClick={() => this.spliceIn('items', i)}>X</button>
              </div>
            )}

            <button onClick={() => this.pushIn('items', {})}>Add Item</button>
          </div>
        );
      }
    }
  `;

  render() {
    return (
      <div>
        {this.renderExample()}

        <TextField {...this.$('fullName')} placeholder="Full Name" />

        {this.mapIn('items', (item, i) =>
          <div key={i}>
            <ItemForm attrs={item} onChange={(form) => this.merge(`items.${i}`, form)} />
            <button onClick={() => this.spliceIn('items', i)}>X</button>
          </div>
        )}

        <button onClick={() => this.pushIn('items', {})}>Add Item</button>
      </div>
    );
  }
}
