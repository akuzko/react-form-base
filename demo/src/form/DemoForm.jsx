import React from 'react';
import marked from 'marked';
import Form from '../../../src';
import { Source } from '../components';

export default class DemoForm extends Form {
  render(content) {
    const { name, title, description, source, showErrors } = this.constructor;

    return (
      <div className='pb-20 mb-20 border-bottom'>
        <div className='mb-10 bold-text'>{title}</div>
        <div className='mb-20' dangerouslySetInnerHTML={{ __html: marked(description) }} />
        <div className='horizontal-container'>
          <div className='flex-item mr-20'>
            { source.map(([title, code]) =>
              <Source key={title} title={title}>{code}</Source>
            )}
          </div>
          <div className='flex-item'>
            <div>{content}</div>
            <pre>Attrs: {JSON.stringify(this.props.attrs)}</pre>
            { showErrors &&
              <pre>Errors: {JSON.stringify(this.state.errors)}</pre>
            }
          </div>
        </div>
      </div>
    );
  }
}
