import React, { Component } from 'react';
import DemoForm from './DemoForm';

export default class App extends Component {
  state = {
    form: {}
  };

  validate = () => {
    this.refs.form.performValidation();
  };

  render() {
    const { form, errors } = this.state;

    return (
      <div>
        <DemoForm
          ref="form"
          attrs={form}
          errors={errors}
          onChange={(form, errors) => this.setState({ form, errors })}
          validateOnChange
        />
        <button onClick={this.validate}>Validate</button>
      </div>
    );
  }
};
