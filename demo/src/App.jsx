import React, { Component } from 'react';
import * as Forms from './forms';

export default class App extends Component {
  state = { forms: {} };

  formProps(name) {
    const props = this.state.forms[name] || {};

    return {
      attrs: props.attrs || {},
      onChange: (attrs, errors) => this.setState({
        forms: { ...this.state.forms, [name]: { attrs, errors } }
      })
    };
  }

  render() {
    return (
      <div>
        <Forms.Form1 {...this.formProps('form1')} />
        <hr />
        <Forms.Form2 {...this.formProps('form2')} />
        <hr />
        <Forms.Form3 {...this.formProps('form3')} />
        <hr />
        <Forms.Form4 {...this.formProps('form4')} />
        <hr />
        <Forms.Form5 {...this.formProps('form5')} />
        <hr />
        <Forms.Form6 {...this.formProps('form6')} />
        <hr />
        <Forms.Form7 {...this.formProps('form7')} validateOnChange />
        <hr />
        <Forms.Form8 {...this.formProps('form8')} validateOnChange />
      </div>
    );
  }
};
