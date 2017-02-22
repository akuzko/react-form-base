import React, { PureComponent } from 'react';
import { Intro, InputPrerequisites } from './components';
import * as Forms from './forms';
import { bindState } from '../../src';

const sections = [
  'inputs', 'form01', 'form02', 'form03', 'form04',
  'form05', 'form06', 'form07', 'form08', 'form09', 'form10'
].reverse();

export default class App extends PureComponent {
  state = { section: 'inputs' };

  componentDidMount() {
    window.addEventListener('scroll', this.setActiveSection);
  }

  setActiveSection = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      return this.setState({ section: 'form11' });
    }

    const section = sections.find(id =>
      document.querySelector(`#${id}`).offsetTop - 30 < window.pageYOffset
    ) || 'inputs';

    this.setState({ section });
  }

  isActive(section) {
    return this.state.section === section ? 'active' : '';
  }

  saveForm11 = (attrs, form) => {
    // simulated AJAX request
    return new Promise((resolve, reject) => {
      form.setState({ saving: true, success: false });
      setTimeout(() => {
        if (['foo', 'bar', 'baz'].includes(attrs.account)) {
          reject({ account: 'has already been taken' });
        } else {
          resolve(true);
        }
      }, 3000);
    }).then(success => form.setState({ success, saving: false }))
      .catch(errors => form.setState({ errors, saving: false }));
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
            <Intro />
            <div id="inputs"><InputPrerequisites /></div>
            <div id="form01"><Forms.Form1  {...bindState(this, 'form1')} /></div>
            <div id="form02"><Forms.Form2  {...bindState(this, 'form2')} /></div>
            <div id="form03"><Forms.Form3  {...bindState(this, 'form3')} /></div>
            <div id="form04"><Forms.Form4  {...bindState(this, 'form4')} /></div>
            <div id="form05"><Forms.Form5  {...bindState(this, 'form5')} /></div>
            <div id="form06"><Forms.Form6  {...bindState(this, 'form6')} /></div>
            <div id="form07"><Forms.Form7  {...bindState(this, 'form7')} /></div>
            <div id="form08"><Forms.Form8  {...bindState(this, 'form8')} /></div>
            <div id="form09"><Forms.Form9  {...bindState(this, 'form9')} /></div>
            <div id="form10"><Forms.Form10 {...bindState(this, 'form10')} /></div>
            <div id="form11"><Forms.Form11 {...bindState(this, 'form11')} onRequestSave={this.saveForm11} /></div>
          </div>
        </div>
      </div>
    );
  }
};
