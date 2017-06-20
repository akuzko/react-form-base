import React, { Component } from 'react';
import Form from '../src/Form';
import { bindState, buildHandlersCache } from '../src/utils';
import { shallow } from 'enzyme';
import expect from 'expect';

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

describe('buildHandlersCache', function() {
  context('simple case', function() {
    it('fetches result and caches it', function() {
      const cache = buildHandlersCache();
      const result = cache.fetch('foo', () => ({}));
      expect(cache.fetch('foo', () => 'is not called') === result).toBe(true);
    });
  });

  context('complex case', function() {
    it('fetches result and caches it', function() {
      const cache = buildHandlersCache();
      const fn = function(){};
      const obj = {};
      const result = cache.fetch(['foo', fn, 1, obj, 5], () => fn);

      expect(result).toBe(fn, 'sets result according to setter');
      expect(cache.fetch(['foo', fn, 1, obj, 5], () => 'is not called') === result).toBe(true, 'returns cached value properly');
    });
  });
});
