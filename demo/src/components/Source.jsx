import React, { PropTypes, Component } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';

export default class Source extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired
  };

  state = {
    open: false
  };

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { title, children } = this.props;

    const codeIcon = (
      <svg className="code-icon" viewBox="0 0 502.7 502.7">
        <path d="M153.8 358.2L0 274.3v-46.5l153.8-83.4v54.6L46.6 250.5l107.2 53.4C153.8 304 153.8 358.2 153.8 358.2zM180.1 387.6L282.1 115.1h32.2L212.1 387.6H180.1zM348.8 358.2v-54.3l107.2-53 -107.2-52.6v-53.9l153.8 83.5v46.2L348.8 358.2z"/>
      </svg>
    );

    return (
      <div className='source mb-20'>
        <div className='source-panel horizontal-container center' onClick={this.toggle}>
          <div className='flex-item'>{ title }</div>
          { codeIcon }
        </div>
        <div className='source-code'>
          {this.state.open &&
            <SyntaxHighlighter language="javascript" style={docco}>{children}</SyntaxHighlighter>
          }
        </div>
      </div>
    );
  }
}
