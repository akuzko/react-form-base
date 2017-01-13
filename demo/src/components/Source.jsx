import React, { PropTypes, Component } from 'react';

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

    return (
      <div style={{ border: '1px solid black' }}>
        <div style={{ backgroundColor: '#efefef' }} onClick={this.toggle}>
          <div style={{ float: 'right' }}>⇅</div>
          <div>{ title }</div>
        </div>
        <div style={{ maxHeight: 400, overflow: 'auto' }} hidden={!this.state.open}>
          <pre>{ children }</pre>
        </div>
      </div>
    );
  }
}
