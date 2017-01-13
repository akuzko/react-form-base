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
        <div style={{ float: 'left', width: '25%' }}>
          <div><a href="#form1">{Forms.Form1.title}</a></div>
          <div><a href="#form2">{Forms.Form2.title}</a></div>
          <div><a href="#form3">{Forms.Form3.title}</a></div>
          <div><a href="#form4">{Forms.Form4.title}</a></div>
          <div><a href="#form5">{Forms.Form5.title}</a></div>
          <div><a href="#form6">{Forms.Form6.title}</a></div>
          <div><a href="#form7">{Forms.Form7.title}</a></div>
          <div><a href="#form8">{Forms.Form8.title}</a></div>
        </div>
        <div style={{ float: 'right', width: '75%' }}>
          <div id="form1"><Forms.Form1 {...this.formProps('form1')} /></div>
          <hr />
          <div id="form2"><Forms.Form2 {...this.formProps('form2')} /></div>
          <hr />
          <div id="form3"><Forms.Form3 {...this.formProps('form3')} /></div>
          <hr />
          <div id="form4"><Forms.Form4 {...this.formProps('form4')} /></div>
          <hr />
          <div id="form5"><Forms.Form5 {...this.formProps('form5')} /></div>
          <hr />
          <div id="form6"><Forms.Form6 {...this.formProps('form6')} /></div>
          <hr />
          <div id="form7"><Forms.Form7 {...this.formProps('form7')} validateOnChange /></div>
          <hr />
          <div id="form8"><Forms.Form8 {...this.formProps('form8')} validateOnChange /></div>
        </div>
        <div style={{ clear: 'both' }} />
      </div>
    );
  }
};
