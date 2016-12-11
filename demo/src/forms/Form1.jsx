import React from 'react';
import Form from './ApplicationForm';
import Select from '../inputs/Select';

const items = [1, 2, 3].map(i => ({ value: i, label: `Item ${i}` }));
const amounts = [10, 50, 100];

export default class Form0 extends Form {
  changeItem(value) {
    return this.set({
      item: value,
      amount: null
    });
  }

  render() {
    const { attrs, errors } = this.props;

    return (
      <div>
        <pre>{JSON.stringify(attrs)}</pre>
        <pre>{JSON.stringify(errors)}</pre>

        <Select {...this.$('item')(this.changeItem)} options={items} includeBlank />
        <Select {...this.$('amount')} options={amounts} includeBlank />
      </div>
    );
  }
}
