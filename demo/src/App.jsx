import React, { PureComponent } from 'react';
import InputPrerequisites from './components/InputPrerequisites';
import * as Forms from './forms';

export default class App extends PureComponent {
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
      <div className="container mt-20 mb-20">
        <div className="horizontal-container">
          <div className="navbar">
            <a href="#inputs" className="active">Input Prerequisites</a>
            <a href="#form1">{Forms.Form1.title}</a>
            <a href="#form2">{Forms.Form2.title}</a>
            <a href="#form3">{Forms.Form3.title}</a>
            <a href="#form4">{Forms.Form4.title}</a>
            <a href="#form5">{Forms.Form5.title}</a>
            <a href="#form6">{Forms.Form6.title}</a>
            <a href="#form7">{Forms.Form7.title}</a>
            <a href="#form8">{Forms.Form8.title}</a>
            <a href="#form8">{Forms.Form9.title}</a>
          </div>
          <div className="content paper flex-item p-20">
            <div id="inputs"><InputPrerequisites /></div>
            <div id="form1"><Forms.Form1 {...this.formProps('form1')} /></div>
            <div id="form2"><Forms.Form2 {...this.formProps('form2')} /></div>
            <div id="form3"><Forms.Form3 {...this.formProps('form3')} /></div>
            <div id="form4"><Forms.Form4 {...this.formProps('form4')} /></div>
            <div id="form5"><Forms.Form5 {...this.formProps('form5')} /></div>
            <div id="form6"><Forms.Form6 {...this.formProps('form6')} /></div>
            <div id="form7"><Forms.Form7 {...this.formProps('form7')} /></div>
            <div id="form8"><Forms.Form8 {...this.formProps('form8')} validateOnChange /></div>
            <div id="form8"><Forms.Form9 {...this.formProps('form8')} validateOnChange /></div>
          </div>
        </div>
      </div>
    );
  }
};
