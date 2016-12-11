import React, { Component } from 'react';
import * as Forms from './forms';

export default class App extends Component {
  state = { forms: {} };

  formProps(name) {
    const props = this.state.forms[name] || {};

    return {
      attrs: props.attrs || {},
      errors: props.errors || {},
      onChange: (attrs, errors) => this.setState({
        forms: { ...this.state.forms, [name]: { attrs, errors } }
      })
    };
  }

  render() {
    return (
      <div>
        <Forms.Form1 {...this.formProps('form1')} validateOnChange />
        <hr />
        <Forms.Form2 {...this.formProps('form2')} validateOnChange />
        <hr />
        <Forms.Form3 {...this.formProps('form3')} validateOnChange />
      </div>
    );
  }
};
