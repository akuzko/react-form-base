import React from 'react';
import dedent from 'dedent-js';
import Form, { Select } from '../form';

const items = [1, 2, 3].map(i => ({ value: i, label: `Item ${i}` }));
const amounts = [10, 50, 100];

export default class Form3 extends Form {
  static title = 'Changing several fields at once';
  static description = dedent`
    This form has two \`Select\` inputs for 'items' and 'amount' fields and custom
    \`onChange\` handler that drops 'amount' value whenever 'item' value is changed
  `;
  static source = `
    // read about those setup components at the beginning of examples
    import Form, { Select } from 'form';

    const items = [1, 2, 3].map(i => ({ value: i, label: \`Item \${i}\` }));
    const amounts = [10, 50, 100];

    class Form3 extends Form {
      $item(value) {
        return this.set({
          item: value,
          amount: null
        });
      }

      render() {
        return (
          <div>
            <Select {...this.$('item')(this.$item)} options={items} includeBlank />
            <Select {...this.$('amount')} options={amounts} includeBlank />
          </div>
        );
      }
    }
  `;

  $item(value) {
    return this.set({
      item: value,
      amount: null
    });
  }

  render() {
    return (
      <div>
        {this.renderExample()}

        <Select {...this.$('item')(this.$item)} options={items} includeBlank />
        <Select {...this.$('amount')} options={amounts} includeBlank />
      </div>
    );
  }
}
