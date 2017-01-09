import React from 'react';
import marked from 'marked';
import Form from '../../../src';

export default class DemoForm extends Form {
  renderExample() {
    const { title, description, source } = this.constructor;

    return (
      <div>
        <div><strong>{title}</strong></div>
        <div dangerouslySetInnerHTML={{ __html: marked(description) }} />
        <pre>{source}</pre>
        <pre>{JSON.stringify(this.props.attrs)}</pre>
        <pre>{JSON.stringify(this.state.errors)}</pre>
      </div>
    );
  }
}
