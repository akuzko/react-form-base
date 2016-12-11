import React from 'react';
import Form from './ApplicationForm';
import Input from '../inputs/Input';
import Select from '../inputs/Select';

export default class Form2 extends Form {
  render() {
    const { attrs, errors } = this.props;

    return (
      <div>
        <pre>{JSON.stringify(attrs)}</pre>
        <pre>{JSON.stringify(errors)}</pre>

        <Input {...this.$('foo')} />
        {this.mapExtraIn('items', (i) =>
          <div key={i}>
            <Input {...this.$(`items.${i}.name`)} />
            {this.get(`items.${i}.name`) &&
              <ItemForm attrs={this.get(`items.${i}`)} onChange={(attrs) => this.merge(`items.${i}`, attrs)} />
            }
          </div>
        )}
      </div>
    );
  }
}

class ItemForm extends Form {
  validatations = {
    description: 'presence'
  };

  render() {
    return (
      <div>
        <Input {...this.$('description')} />
        <Select {...this.$('amount')} options={[10, 50, 100]} includeBlank />
      </div>
    );
  }
}
