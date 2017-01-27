import React from 'react';
import dedent from 'dedent-js';
import Form, { TextField, Select } from '../form';

const SOURCE = [['ItemForm.jsx', `
  // read about those setup components at the beginning of examples
  import Form, { TextField, Select } from 'form';

  class ItemForm extends Form {
    $render($) {
      return (
        <div>
          <Select {...$('amount')} options={[10, 50, 100]} includeBlank />
          <TextField {...$('comment')} placeholder="Comment" />
        </div>
      );
    }
  }
`], ['Form6.jsx', `
  // read about those setup components at the beginning of examples
  import Form, { TextField } from 'form';
  import ItemForm from './ItemForm';

  class Form6 extends Form {
    $render($) {
      return (
        <div>
          <TextField {...$('fullName')} placeholder="Full Name" />

          {this.map('items', (_item, i) =>
            <div key={i}>
              <ItemForm {...$.nested(\`items.\${i}\`)} />
              <button onClick={() => this.remove('items', i)}>X</button>
            </div>
          )}

          <button onClick={() => this.push('items', {})}>Add Item</button>
        </div>
      );
    }
  }
`]];

class ItemForm extends Form {
  $render($) {
    return (
      <div className="flex-item mr-20">
        <Select {...$('amount')} options={[10, 50, 100]} includeBlank="Select Amount..." className="form-control mb-20" />
        <TextField {...$('comment')} className="form-control" placeholder="Comment" />
      </div>
    );
  }
}

export default class Form6 extends Form {
  static title = 'Nested Forms';
  static description = dedent`
    This example shows how top-level form can use nested forms to render and
    manipulate single set of attributes.

    In this example, top-level form uses \`map\`, \`push\` and \`remove\`
    helper methods to iterate over it's items for rendering subforms, dynamically
    add and remove items.

    **NOTE:** please note that since Form already allows you to directly manipulate
    nested fields just like non-nested, you should use nested forms only to
    encapsulate big chunks of logic or for making code DRY.
  `;
  static source = SOURCE;

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
        <TextField {...$('fullName')} className="form-control mb-20" placeholder="Full Name" />

        {this.map('items', (_item, i) =>
          <div key={i} className="horizontal-container center mb-20 bordered-form-item">
            <ItemForm {...$.nested(`items.${i}`)} />

            <div className="pointer" onClick={() => this.remove('items', i)}>
              {deleteIcon}
            </div>
          </div>
        )}

        <div className="text-right">
          <button className="btn green mb-20" onClick={() => this.push('items', {})}>Add Item</button>
        </div>
      </div>
    );
  }
}
