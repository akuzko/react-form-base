import React, { PropTypes, Component } from 'react';
import Form from '../src';
import { mount, shallow } from 'enzyme';
import expect, { createSpy } from 'expect';
import range from 'lodash/range';
import without from 'lodash/without';

describe('<Form />', function() {
  let TestForm;
  let formProps = {};

  class Input extends Component {
    static propTypes = {
      onChange: PropTypes.func,
      value: PropTypes.string,
      error: PropTypes.string
    };

    handleChange = (e) => {
      return this.props.onChange(e.target.value);
    };

    render() {
      const { error, value, ...rest } = this.props;
      return (
        <div>
          <input {...rest} value={value || ''} onChange={this.handleChange} />
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
      return (
        <TestForm
          ref="form"
          {...formProps}
          attrs={this.state.form}
          onChange={(form) => this.setState({ form })}
        />
      );
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
      };

      this.currentTest.wrapper = mount(<Container />);
    });

    it('renders form', function() {
      expect(this.test.wrapper.find('input.foo').length).toEqual(1);
    });

    it('handles change event with default handler', function() {
      this.test.wrapper.find('.foo').simulate('change', { target: { value: 'new value' } });
      expect(this.test.wrapper.state('form').foo).toEqual('new value');
    });

    it('handles change event with explicit handler', function() {
      this.test.wrapper.find('.bar').simulate('change', { target: { value: 'new value' } });
      expect(this.test.wrapper.state('form').bar).toEqual('NEW VALUE');
    });

    it('renders errors', function() {
      this.test.wrapper.instance().refs.form.setState({ errors: { foo: 'cannot be blank' } });
      expect(this.test.wrapper.find('.error').get(0).innerHTML).toEqual('cannot be blank');
    });
  });

  describe('composite fields', function() {
    beforeEach(function() {
      TestForm = class extends Form {
        $itemBar(i, value) {
          return this.set(`items.${i}.bar`, value.toUpperCase());
        }

        render() {
          return (
            <div>
              {range(3).map(i =>
                <div key={i}>
                  <Input {...this.$(`items.${i}.foo`)} className={`item-foo-${i}`} />
                  <Input {...this.$(`items.${i}.bar`)(this.$itemBar, i)} className={`item-bar-${i}`} />
                </div>
              )}
            </div>
          );
        }
      };

      this.currentTest.wrapper = mount(<Container />);
    });

    it('handles change with default handler', function() {
      this.test.wrapper.find('.item-foo-1').simulate('change', { target: { value: 'item foo' } });
      expect(this.test.wrapper.state('form').items).toMatch([, { foo: 'item foo' }]);
    });

    it('handles change with explicit handler', function() {
      this.test.wrapper.find('.item-bar-1').simulate('change', { target: { value: 'item bar' } });
      expect(this.test.wrapper.state('form').items).toMatch([, { bar: 'ITEM BAR' }]);
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
      };

      this.currentTest.wrapper = mount(<Container />);
    });

    it('still handles own attrs', function() {
      this.test.wrapper.find('.own').simulate('change', { target: { value: 'own value' } });
      expect(this.test.wrapper.state('form').own).toEqual('own value');
    });

    it('changes in nested form propagated up', function() {
      this.test.wrapper.find('.foo').simulate('change', { target: { value: 'foo value' } });
      expect(this.test.wrapper.state('form').nested).toEqual({ foo: 'foo value' });
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
        $itemName(i, value) {
          if (value) {
            this.set(`items.${i}.name`, value);
          } else {
            const items = without(this.items, this.items[i]);

            this.set('items', items);
          }
        }

        get items() {
          return this.get('items') || [];
        }

        render() {
          const totalItems = this.items.length + 1;

          return (
            <div>
              {range(totalItems + 1).map(i =>
                <div key={i}>
                  <Input {...this.$(`items.${i}.name`)(this.$itemName, i)} className={`item-name-${i}`} />

                  {this.get(`items.${i}.name`) &&
                    <ItemForm index={i} attrs={this.get(`items.${i}`) || {}} onChange={(attrs) => this.merge(`items.${i}`, attrs)} />
                  }
                </div>
              )}
            </div>
          );
        }
      };

      this.currentTest.wrapper = mount(<Container />);
    });

    it('initially has only one input for name', function() {
      expect(this.test.wrapper.find('.item-name-0').length).toEqual(1);
      expect(this.test.wrapper.find('.item-description-0').length).toEqual(0);
    });

    context('when name is changed', function() {
      it('renders form for item and new empty name field for new item', function() {
        this.test.wrapper.find('.item-name-0').simulate('change', { target: { value: 'item 1' } });
        expect(this.test.wrapper.state('form')).toMatch({ items: [{ name: 'item 1' }] });
        expect(this.test.wrapper.find('.item-description-0').length).toEqual(1);
        expect(this.test.wrapper.find('.item-name-1').length).toEqual(1);
        expect(this.test.wrapper.find('.item-description-1').length).toEqual(0);
      });

      it('handles nested input changes from nested form', function() {
        this.test.wrapper.find('.item-name-0').simulate('change', { target: { value: 'item 1' } });
        this.test.wrapper.find('.item-description-0').simulate('change', { target: { value: 'item 1 description' } });
        expect(this.test.wrapper.state('form')).toMatch({ items: [{ name: 'item 1', description: 'item 1 description' }] });
      });

      it('removes item when name is erased', function() {
        this.test.wrapper.find('.item-name-0').simulate('change', { target: { value: 'item 1' } });
        this.test.wrapper.find('.item-description-0').simulate('change', { target: { value: 'item 1 description' } });
        this.test.wrapper.find('.item-name-1').simulate('change', { target: { value: 'item 2' } });
        this.test.wrapper.find('.item-name-0').simulate('change', { target: { value: '' } });
        expect(this.test.wrapper.state('form')).toMatch({ items: [{ name: 'item 2' }] });
      });
    });
  });

  describe('validation', function() {
    context('common case, default validation', function() {
      beforeEach(function() {
        TestForm = class extends Form {
          validations = {
            'foo'(value) {
              if (!value) return 'cannot be blank';
            }
          };

          render() {
            return (
              <div>
                <Input {...this.$('foo')} className="foo" />
              </div>
            );
          }
        };

        this.currentTest.wrapper = mount(<Container />);
      });

      it('performs validation according to validations property', function() {
        this.test.wrapper.instance().refs.form.performValidation();

        expect(this.test.wrapper.instance().refs.form.state.errors).toMatch({
          'foo': 'cannot be blank'
        });
      });
    });

    context('common case with wildcards', function() {
      beforeEach(function() {
        TestForm = class extends Form {
          validations = {
            'foo'(value) {
              if (!value) return 'cannot be blank';
            },
            'items.*.bar'(value) {
              if (!value || isNaN(+value)) return 'should be numeric';
            }
          };

          validate(validate) {
            validate('foo');
            range(2).forEach(i => validate(`items.${i}.bar`));

            return validate.errors;
          }

          render() {
            return (
              <div>
                <Input {...this.$('foo')} className="foo" />

                {range(2).map(i =>
                  <div key={i}>
                    <Input {...this.$(`items.${i}.bar`)} className={`item-bar-${i}`} />
                  </div>
                )}
              </div>
            );
          }
        };

        this.currentTest.wrapper = mount(<Container />);
      });

      it('performs validation according to validations property', function() {
        this.test.wrapper.instance().refs.form.performValidation();

        expect(this.test.wrapper.instance().refs.form.state.errors).toMatch({
          'foo': 'cannot be blank',
          'items.0.bar': 'should be numeric',
          'items.1.bar': 'should be numeric'
        });
      });
    });

    context('custom validation logic', function() {
      beforeEach(function() {
        TestForm = class extends Form {
          static validations = {
            presence: function(value) { if (!value) return 'cannot be blank'; },
            numericality: function(value, { greaterThan } = {}) {
              if (isNaN(+value)) return 'should be a number';
              if (typeof greaterThan != undefined && +value <= greaterThan) return `should be greater than ${greaterThan}`;
            }
          };

          validations = {
            'foo': ['presence', 'numericality'],
            'bar': { presence: true, numericality: { greaterThan: 5 } }
          };

          validate(validate) {
            validate('foo');
            validate('bar');
            validate('baz', { with: function(){ return 'invalid'; } });
            range(2).forEach(i =>
              validate(`items.${i}.bar`, { with: 'presence' })
            );
            validate.addError('bak', 'another invalid');

            return validate.errors;
          }

          render() {
            return (
              <div>
                <Input {...this.$('foo')} className="foo" />
                <Input {...this.$('bar')} className="bar" />
                <Input {...this.$('baz')} className="baz" />
                <Input {...this.$('bak')} className="bak" />

                {range(2).map(i =>
                  <div key={i}>
                    <Input {...this.$(`items.${i}.bar`)} className={`item-bar-${i}`} />
                  </div>
                )}
              </div>
            );
          }
        };

        this.currentTest.wrapper = mount(<Container />);
      });

      it('performs validation according to specified logic', function() {
        this.test.wrapper.find('.bar').simulate('change', { target: { value: '4' } });

        this.test.wrapper.instance().refs.form.performValidation();

        expect(this.test.wrapper.instance().refs.form.state.errors).toMatch({
          'foo': 'cannot be blank',
          'bar': 'should be greater than 5',
          'baz': 'invalid',
          'bak': 'another invalid',
          'items.0.bar': 'cannot be blank',
          'items.1.bar': 'cannot be blank'
        });
      });
    });

    describe('clearErrorsOnChange and validateOnChange properties', function() {
      beforeEach(function() {
        TestForm = class extends Form {
          static validations = {
            presence: function(value) { if (!value) return 'cannot be blank'; }
          };

          validations = {
            'foo': 'presence'
          };

          render() {
            return (
              <div>
                <Input {...this.$('foo')} className="foo" />
              </div>
            );
          }
        };

        this.currentTest.wrapper = mount(<Container />);
      });

      describe('clearErrorsOnChange', function() {
        beforeEach(function() {
          formProps = {
            clearErrorsOnChange: true
          };
        });

        it('clears error when input value changes', function() {
          this.test.wrapper.instance().refs.form.performValidation();

          expect(this.test.wrapper.instance().refs.form.state.errors).toMatch({
            'foo': 'cannot be blank'
          });

          this.test.wrapper.find('.foo').simulate('change', { target: { value: 'foo' } });

          expect(this.test.wrapper.instance().refs.form.state.errors).toMatch({
            'foo': null
          });
        });
      });

      describe('validateOnChange', function() {
        beforeEach(function() {
          formProps = {
            validateOnChange: true
          };
        });

        context('when was not validated before', function() {
          it('does not trigger onChange validation', function() {
            this.test.wrapper.find('.foo').simulate('change', { target: { value: 'foo' } });
            expect(this.test.wrapper.instance().refs.form.state.errors).toMatch({});

            this.test.wrapper.find('.foo').simulate('change', { target: { value: '' } });
            expect(this.test.wrapper.instance().refs.form.state.errors).toMatch({});
          });
        });

        context('after first error-resulted validation', function() {
          it('validates input when its value changes', function() {
            this.test.wrapper.instance().refs.form.performValidation();
            expect(this.test.wrapper.instance().refs.form.state.errors).toMatch({
              'foo': 'cannot be blank'
            });

            this.test.wrapper.find('.foo').simulate('change', { target: { value: 'foo' } });
            expect(this.test.wrapper.instance().refs.form.state.errors).toMatch({
              'foo': null
            });

            this.test.wrapper.find('.foo').simulate('change', { target: { value: '' } });
            expect(this.test.wrapper.instance().refs.form.state.errors).toMatch({
              'foo': 'cannot be blank'
            });
          });
        });
      });
    });

    describe('ifValid helper method', function() {
      function mount(){
        class TestForm extends Form {
          validations = {
            'foo': function(value) {
              if (!value) return 'cannot be blank';
            }
          };
        }

        this.currentTest.wrapper = shallow(<TestForm attrs={ this.currentTest.attrs} />);
      }

      context('when form is valid', function() {
        beforeEach(function() {
          this.currentTest.attrs = {foo: 'bar'};
          mount.call(this);
        });

        it('triggers callback', function() {
          const spy = createSpy();
          this.test.wrapper.instance().ifValid(spy);
          expect(spy).toHaveBeenCalled();
        });
      });

      context('when form is invalid', function() {
        beforeEach(function() {
          this.currentTest.attrs = {};
          mount.call(this);
        });

        it('does not trigger callback', function() {
          const spy = createSpy();
          this.test.wrapper.instance().ifValid(spy);
          expect(spy).toNotHaveBeenCalled();
        });
      });
    });
  });

  describe('helper methods', function() {
    beforeEach(function() {
      this.currentTest.wrapper = shallow(<Form attrs={{ foo: 'bar' }} />);
    });

    describe('get', function() {
      it('returns value when it is defined', function() {
        expect(this.test.wrapper.instance().get('foo')).toEqual('bar');
      });

      it('returns undefined when value is not defined', function() {
        expect(this.test.wrapper.instance().get('bar')).toEqual(undefined);
      });

      it('returns whole attrs object when name is not passed', function() {
        expect(this.test.wrapper.instance().get()).toMatch({ foo: 'bar' });
      });
    });
  });

  describe('$render', function() {
    beforeEach(function() {
      TestForm = class extends Form {
        $render($) {
          return <Input {...$('foo')} className="foo" />;
        }
      };

      this.currentTest.wrapper = mount(<Container />);
    });

    it('works just like usual rendering', function() {
      this.test.wrapper.find('.foo').simulate('change', { target: { value: 'new value' } });
      expect(this.test.wrapper.state('form').foo).toEqual('new value');
    });
  });
});
