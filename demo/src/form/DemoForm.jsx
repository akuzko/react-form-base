import React from 'react';
import Form from '../../../src';

export default class DemoForm extends Form {
  renderExample() {
    const { title, description, source } = this.constructor;
    const { attrs, errors } = this.props;

    return (
      <div>
        <div><strong>{title}</strong></div>
        <div>{description}</div>
        <pre>{source}</pre>
        <pre>{JSON.stringify(attrs)}</pre>
        <pre>{JSON.stringify(errors)}</pre>
      </div>
    );
  }
}
