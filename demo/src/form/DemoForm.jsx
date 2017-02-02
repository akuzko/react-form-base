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
        <h5 className="mb-20"><span>&sect;</span> {title}</h5>
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
              <pre className="flex-item horizontal-scroll font-14">attrs: {JSON.stringify(this.props.attrs, null, '  ')}</pre>
              {showErrors &&
                <pre className="flex-item horizontal-scroll font-14 ml-15">errors: {JSON.stringify(this.getErrors(), null, '  ')}</pre>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
