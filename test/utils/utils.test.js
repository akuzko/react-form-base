import React, { Component } from 'react';
import Form from '../../src/Form';
import { nameToPath, bindState } from '../../src/utils';
import { shallow } from 'enzyme';
import expect from 'expect';

describe('nameToPath', function() {
  it('generates a lodash path based on passed name', function() {
    expect(nameToPath('foo.1.bar.baz')).toEqual('foo[1].bar.baz');
  });
});

describe('bindState', function() {
  class Page extends Component {
    render() {
      return <Form {...bindState(this)} />;
    }
  }

  context('when component has no state defined', function() {
    it('passes empty object as attrs', function() {
      const wrapper = shallow(<Page />);
      expect(wrapper.find(Form).prop('attrs')).toEqual({});
    });
  });

  context('when component has defined state', function() {
    it('passes empty object as attrs', function() {
      const wrapper = shallow(<Page />);
      wrapper.setState({ form: { foo: 'bar' } });
      expect(wrapper.find(Form).prop('attrs')).toEqual({ foo: 'bar' });
    });
  });

  context('with custom key', function() {
    class Page extends Component {
      render() {
        return <Form {...bindState(this, 'myForm')} />;
      }
    }

    it('passes empty object as attrs', function() {
      const wrapper = shallow(<Page />);
      wrapper.setState({ myForm: { foo: 'bar' } });
      expect(wrapper.find(Form).prop('attrs')).toEqual({ foo: 'bar' });
    });
  });

  it('updates state when form changes', function() {
    const wrapper = shallow(<Page />);
    wrapper.find(Form).prop('onChange')({ foo: 'bar' });
    expect(wrapper.state()).toEqual({ form: { foo: 'bar' } });
  });
});
