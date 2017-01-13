import React from 'react';
import marked from 'marked';
import Form from '../../../src';
import { Source } from '../components';

export default class DemoForm extends Form {
  render(content) {
    const { name, title, description, source, showErrors } = this.constructor;

    return (
      <div>
        <div><strong>{title}</strong></div>
        <div dangerouslySetInnerHTML={{ __html: marked(description) }} />
        <div style={{ float: 'left', width: '50%' }}>
          { source.map(([title, code]) =>
            <Source key={title} title={title}>{code}</Source>
          )}
        </div>
        <div style={{ float: 'right', width: '50%' }}>
          <div>{content}</div>
          <pre>Attrs: {JSON.stringify(this.props.attrs)}</pre>
          { showErrors &&
            <pre>Errors: {JSON.stringify(this.state.errors)}</pre>
          }
        </div>
        <div style={{ clear: 'both' }}></div>
      </div>
    );
  }
}
