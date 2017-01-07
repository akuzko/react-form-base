import React from 'react';
import Form from './ApplicationForm';
import Input from '../inputs/Input';

export default class Form2 extends Form {
  static title = 'Usage of custom onChange handler';
  static description = `This form uses custom onChange handler (named $lastName)
    for 'lastName' field changes.
  `;
  static source = `
    // read about those setup components at the beginning of README
    import Form, { Input } from 'form';

    class Form2 extends Form {
      $lastName(value) {
        return this.set('lastName', value.toUpperCase());
      }

      render() {
        return (
          <div>
            <Input {...this.$('firstName')} />
            <Input {...this.$('lastName')(this.$lastName)} />
          </div>
        );
      }
    }
  `;

  $lastName(value) {
    return this.set('lastName', value.toUpperCase());
  }

  render() {
    return (
      <div>
        {this.renderExample()}

        <Input {...this.$('firstName')} placeholder="First Name" />
        <Input {...this.$('lastName')(this.$lastName)} placeholder="Last Name" />
      </div>
    );
  }
}
