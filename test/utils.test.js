import React, { Component } from 'react';
import Form from '../src/Form';
import { bindState, updated } from '../src/utils';
import { shallow } from 'enzyme';
import expect from 'expect';

describe('updated', function() {
  it('carefully sets deeply nested item: deeply nested array', function() {
    const obj = { foo: { bar: { baz: [1, 2, 3] } }, bak: { big: 1 } };
    const upd = updated(obj, 'foo.bar.baz.1', 4);
    
    expect(obj === upd).toBe(false, 'obj should not be updated in place');
    expect(obj.foo === upd.foo).toBe(false, 'obj.foo should not be updated in place');
    expect(obj.foo.bar === upd.foo.bar).toBe(false, 'obj.foo.bar should not be updated in place');
    expect(obj.foo.bar.baz === upd.foo.bar.baz).toBe(false, 'obj.foo.bar.baz should not be updated in place');
    expect(obj.bak === upd.bak).toBe(true, 'obj.bak should not be cloned');
    expect(upd.foo.bar.baz).toMatch([1, 4, 3], 'value under desired name should be updated');
  });

  it('carefully sets deeply nested item: deeply nested object', function() {
    const obj = { foo: { bar: [{ baz: 'baz1' }, { baz: 'baz2' }] }, bak: { big: 1 } };
    const upd = updated(obj, 'foo.bar.1.baz', 'baz3');
    
    expect(obj === upd).toBe(false, 'obj should not be updated in place');
    expect(obj.foo === upd.foo).toBe(false, 'obj.foo should not be updated in place');
    expect(obj.foo.bar === upd.foo.bar).toBe(false, 'obj.foo.bar should not be updated in place');
    expect(obj.foo.bar[0] === upd.foo.bar[0]).toBe(true, 'obj.foo.bar items should not be cloned');
    expect(obj.bak === upd.bak).toBe(true, 'obj.bak should not be cloned');
    expect(upd.foo.bar[1]).toMatch({ baz: 'baz3' }, 'value under desired name should be updated');
  });

  it('carefully sets deeply nested item, path collections are not defined', function() {
    const obj = { bak: { big: 1 } };
    const upd = updated(obj, 'foo.bar.baz.1', 4);
    
    expect(obj.bak === upd.bak).toBe(true, 'obj.bak should not be cloned');
    expect(upd.foo.bar.baz).toMatch([undefined, 4], 'value under desired name should be updated');
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
