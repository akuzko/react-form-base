import React, { PropTypes, Component } from 'react';
import Form from '../../src';
import { mount, simulate } from 'enzyme';
import expect from 'expect';
import range from 'lodash/range';

describe('<Form />', function() {
  let TestForm;

  class Input extends Component {
    handleChange = (e) => {
      return this.props.onChange(e.target.value);
    };

    render() {
      const { error, ...rest } = this.props;
      return (
        <div>
          <input {...rest} onChange={this.handleChange} />
          {error &&
            <div className="error">{error}</div>
          }
        </div>
      );
    }
  }

  class Container extends Component {
    state = { form: {} };

    render() {
      return <TestForm attrs={this.state.form} onChange={(form) => this.setState({ form })} />;
    }
  }

  describe('trivial case', function() {
    beforeEach(function() {
      TestForm = class extends Form {
        $bar(value) {
          return this.set('bar', value.toUpperCase());
        }

        render() {
          return (
            <div>
              <Input {...this.$('foo')} className="foo" />
              <Input {...this.$('bar')(this.$bar)} className="bar" />
            </div>
          );
        }
      }

      this.wrapper = mount(<Container />);
    });

    it('renders form', function() {
      expect(this.wrapper.find('input.foo').length).toEqual(1);
    });

    it('handles change event with default handler', function() {
      this.wrapper.find('.foo').simulate('change', { target: { value: 'new value' } });
      expect(this.wrapper.state('form').foo).toEqual('new value');
    });

    it('handles change event with explicit handler', function() {
      this.wrapper.find('.bar').simulate('change', { target: { value: 'new value' } });
      expect(this.wrapper.state('form').bar).toEqual('NEW VALUE');
    });

    it('renders errors', function() {
      this.wrapper.setState({ form: { foo: { value: 'bad', error: 'can\'t be bad' } } });
      expect(this.wrapper.find('.error').get(0).innerHTML).toEqual('can\'t be bad');
    });
  });

  describe('composite fields', function() {
    beforeEach(function() {
      TestForm = class extends Form {
        $itemBar(i, value) {
          return this.set('items', i, 'bar', value.toUpperCase());
        }

        render() {
          return (
            <div>
              {range(3).map(i =>
                <div key={i}>
                  <Input {...this.$('items', i, 'foo')} className={`item-foo-${i}`} />
                  <Input {...this.$('items', i, 'bar')(this.$itemBar, i)} className={`item-bar-${i}`} />
                </div>
              )}
            </div>
          );
        }
      }

      this.wrapper = mount(<Container />);
    });

    it('handles change with default handler', function() {
      this.wrapper.find('.item-foo-1').simulate('change', { target: { value: 'item foo' } });
      expect(this.wrapper.state('form').items).toMatch([, { foo: 'item foo' }]);
    });

    it('handles change with explicit handler', function() {
      this.wrapper.find('.item-bar-1').simulate('change', { target: { value: 'item bar' } });
      expect(this.wrapper.state('form').items).toMatch([, { bar: 'ITEM BAR' }]);
    });
  });

  describe('nested form', function() {
    beforeEach(function() {
      class NestedForm extends Form {
        render() {
          return (
            <div>
              <Input {...this.$('foo')} className="foo" />
              <Input {...this.$('bar')} className="bar" />
            </div>
          );
        }
      }

      TestForm = class extends Form {
        render() {
          return (
            <div>
              <Input {...this.$('own')} className="own" />
              <NestedForm attrs={this.get('nested') || {}} onChange={(attrs) => this.set('nested', attrs)} />
            </div>
          );
        }
      }

      this.wrapper = mount(<Container />);
    });

    it('still handles own attrs', function() {
      this.wrapper.find('.own').simulate('change', { target: { value: 'own value' } });
      expect(this.wrapper.state('form').own).toEqual('own value');
    });

    it('changes in nested form propagated up', function() {
      this.wrapper.find('.foo').simulate('change', { target: { value: 'foo value' } });
      expect(this.wrapper.state('form').nested).toEqual({ foo: 'foo value' });
    });
  });

  describe('multiple nested forms, composite fields', function() {
    beforeEach(function() {
      class ItemForm extends Form {
        render() {
          return <Input {...this.$('description')} className={`item-description-${this.props.index}`} />;
        }
      }

      TestForm = class extends Form {
        get items() {
          return this.get('items') || [];
        }
        render() {
          const totalItems = this.items.length + 1;

          return (
            <div>
              {range(totalItems + 1).map(i =>
                <div key={i}>
                  <Input {...this.$('items', i, 'name')} className={`item-name-${i}`} />
                  {this.get('items', i, 'name') &&
                    <ItemForm index={i} attrs={this.get('items', i) || {}} onChange={(attrs) => this.merge('items', i, attrs)} />
                  }
                </div>
              )}
            </div>
          );
        }
      }

      this.wrapper = mount(<Container />);
    });

    it('initially has only one input for name', function() {
      expect(this.wrapper.find('.item-name-0').length).toEqual(1);
      expect(this.wrapper.find('.item-description-0').length).toEqual(0);
    });

    context('when name is changed', function() {
      it('renders form for item and new empty name field for new item', function() {
        this.wrapper.find('.item-name-0').simulate('change', { target: { value: 'item 1' } });
        expect(this.wrapper.state('form')).toMatch({ items: [{ name: 'item 1' }] });
        expect(this.wrapper.find('.item-description-0').length).toEqual(1);
        expect(this.wrapper.find('.item-name-1').length).toEqual(1);
        expect(this.wrapper.find('.item-description-1').length).toEqual(0);
      });

      it('handles nested input changes from nested form', function() {
        this.wrapper.find('.item-name-0').simulate('change', { target: { value: 'item 1' } });
        this.wrapper.find('.item-description-0').simulate('change', { target: { value: 'item 1 description' } });
        expect(this.wrapper.state('form')).toMatch({ items: [{ name: 'item 1', description: 'item 1 description' }] });
      });
    });
  });
});
