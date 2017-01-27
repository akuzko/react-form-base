import React, { PureComponent } from 'react';
import InputPrerequisites from './components/InputPrerequisites';
import isInViewport from './utils/isInViewport';
import * as Forms from './forms';

export default class App extends PureComponent {
  state = { forms: {}, active: ['inputs', 'form01'] };

  componentDidMount() {
    window.addEventListener('scroll', this.setVisibleActivity.bind(this));
  }

  setVisibleActivity() {
    const active = [
      'inputs', 'form01', 'form02', 'form03', 'form04', 'form05',
      'form06', 'form07', 'form08', 'form09', 'form10', 'form11'
    ].filter(id => {
      const div = document.querySelector(`#${id}`);

      return isInViewport(div);
    });

    this.setState({ active });
  }

  isActive(section) {
    return this.state.active.includes(section) && 'active';
  }

  formProps(name) {
    const props = this.state.forms[name] || {};

    return {
      attrs: props.attrs || {},
      onChange: (attrs, errors) => this.setState({
        forms: { ...this.state.forms, [name]: { attrs, errors } }
      })
    };
  }

  saveForm11 = (attrs, form) => {
    form.ifValid(() => {
      // simulated AJAX request
      return new Promise((resolve, reject) => {
        form.setState({ saving: true, success: false });
        setTimeout(() => {
          if (['foo', 'bar', 'baz'].includes(attrs.account)) {
            reject({ account: 'has already been taken' });
          } else {
            resolve({ status: 200 });
          }
        }, 3000);
      }).then(() => form.setState({ saving: false, success: true }))
        .catch(errors => form.setState({ errors, saving: false }));
    });
  };

  render() {
    return (
      <div className="container mt-20 mb-20">
        <div className="horizontal-container">
          <div className="navbar">
            <a href="#inputs" className={ this.isActive('inputs') }>Input Prerequisites</a>
            <a href="#form01" className={ this.isActive('form01') }>{Forms.Form1.title}</a>
            <a href="#form02" className={ this.isActive('form02') }>{Forms.Form2.title}</a>
            <a href="#form03" className={ this.isActive('form03') }>{Forms.Form3.title}</a>
            <a href="#form04" className={ this.isActive('form04') }>{Forms.Form4.title}</a>
            <a href="#form05" className={ this.isActive('form05') }>{Forms.Form5.title}</a>
            <a href="#form06" className={ this.isActive('form06') }>{Forms.Form6.title}</a>
            <a href="#form07" className={ this.isActive('form07') }>{Forms.Form7.title}</a>
            <a href="#form08" className={ this.isActive('form08') }>{Forms.Form8.title}</a>
            <a href="#form09" className={ this.isActive('form09') }>{Forms.Form9.title}</a>
            <a href="#form10" className={ this.isActive('form10') }>{Forms.Form10.title}</a>
            <a href="#form11" className={ this.isActive('form11') }>{Forms.Form11.title}</a>
          </div>
          <div className="content paper flex-item p-20">
            <div id="inputs"><InputPrerequisites /></div>
            <div id="form01"><Forms.Form1 {...this.formProps('form1')} /></div>
            <div id="form02"><Forms.Form2 {...this.formProps('form2')} /></div>
            <div id="form03"><Forms.Form3 {...this.formProps('form3')} /></div>
            <div id="form04"><Forms.Form4 {...this.formProps('form4')} /></div>
            <div id="form05"><Forms.Form5 {...this.formProps('form5')} /></div>
            <div id="form06"><Forms.Form6 {...this.formProps('form6')} /></div>
            <div id="form07"><Forms.Form7 {...this.formProps('form7')} /></div>
            <div id="form08"><Forms.Form8 {...this.formProps('form8')} validateOnChange /></div>
            <div id="form09"><Forms.Form9 {...this.formProps('form9')} validateOnChange /></div>
            <div id="form10"><Forms.Form10 {...this.formProps('form10')} validateOnChange /></div>
            <div id="form11"><Forms.Form11 {...this.formProps('form11')} onRequestSave={this.saveForm11} validateOnChange /></div>
          </div>
        </div>
      </div>
    );
  }
};
