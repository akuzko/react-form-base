import React from 'react';
import Form from '../../../src';

export default class DemoForm extends Form {
  renderExample() {
    const { title, description, source } = this.constructor;

    return (
      <div>
        <div><strong>{title}</strong></div>
        <div>{description}</div>
        <pre>{source}</pre>
        <pre>{JSON.stringify(this.props.attrs)}</pre>
        <pre>{JSON.stringify(this.state.errors)}</pre>
      </div>
    );
  }
}
