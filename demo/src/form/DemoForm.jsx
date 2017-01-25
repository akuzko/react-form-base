import React from 'react';
import marked from 'marked';
import Form from '../../../src';
import { Source } from '../components';

export default class DemoForm extends Form {
  render() {
    const { title, description, source, showErrors } = this.constructor;

    if (!title) return super.render();

    return (
      <div className="pb-20 mb-20 border-bottom">
        <div className="mb-10 bold-text">{title}</div>
        <div className="mb-20" dangerouslySetInnerHTML={{ __html: marked(description) }} />
        <div className="horizontal-container">
          <div className="flex-item mr-20">
            {source.map(([title, code]) =>
              <Source key={title} title={title}>{code}</Source>
            )}
          </div>
          <div className="flex-item">
            <div>{super.render()}</div>
            <div className="horizontal-container">
              <pre className="flex-item">attrs: {JSON.stringify(this.props.attrs, null, '  ')}</pre>
              {showErrors &&
                <pre className="flex-item">errors: {JSON.stringify(this.state.errors, null, '  ')}</pre>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
