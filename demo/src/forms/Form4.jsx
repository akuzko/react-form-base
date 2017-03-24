import React from 'react';
import dedent from 'dedent-js';
import Form, { Select } from '../form';

const SOURCE = [['Form4.jsx', `
  // read about those setup components at the beginning of examples
  import Form, { Select } from 'form';

  const items = [1, 2, 3].map(i => ({ value: i, label: \`Item \${i}\` }));
  const amounts = [10, 50, 100];

  class Form4 extends Form {
    $item(value) {
      return this.set({
        item: value,
        amount: ''
      });
    }

    $render($) {
      return (
        <div>
          <Select {...$('item')(this.$item)} options={items} includeBlank="Select Item..." />
          <Select {...$('amount')} options={amounts} includeBlank="Select Amount..." />
        </div>
      );
    }
  }
`]];

const items = [1, 2, 3].map(i => ({ value: i, label: `Item ${i}` }));
const amounts = [10, 50, 100];

export default class Form4 extends Form {
  static title = 'Changing several fields at once';
  static description = dedent`
    This form has two \`Select\` inputs for \`'items'\` and \`'amount'\` fields and custom
    onChange handler that drops \`'amount'\` value whenever \`'item'\` value is changed
  `;
  static source = SOURCE;

  $item(value) {
    return this.set({
      item: value,
      amount: ''
    });
  }

  $render($) {
    return (
      <div>
        <Select {...$('item')(this.$item)} options={items} includeBlank="Select Item..." className="form-control mb-20" />
        <Select {...$('amount')} options={amounts} includeBlank="Select Amount..." className="form-control mb-20" />
      </div>
    );
  }
}
