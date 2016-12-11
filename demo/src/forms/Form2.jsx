import React from 'react';
import Form from './ApplicationForm';
import Input from '../inputs/Input';

export default class Form1 extends Form {
  validations = {
    foo: ['presence', 'email']
  };

  render() {
    const { attrs, errors } = this.props;

    return (
      <div>
        <pre>{JSON.stringify(attrs)}</pre>
        <pre>{JSON.stringify(errors)}</pre>

        <Input {...this.$('foo')} />
        {this.mapExtraIn('bars', (i) =>
          <Input key={i} {...this.$(`bars.${i}`)} />
        )}
        <button onClick={this.performValidation.bind(this)}>Validate</button>
      </div>
    );
  }
}
