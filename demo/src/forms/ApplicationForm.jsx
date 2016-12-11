import Form from '../../../src';

export default class ApplicationForm extends Form {
  static validations = {
    presence(value) { if (!value) return 'cannot be blank'; },
    email(value) {
      if (value && !/^[\w\d\.]+@[\w\d\.]+$/.test(value)) {
        return 'should be email';
      }
    },
    numericality(value, options = {}) {
      const { greaterThan } = options;

      if (!value) return null;
      if (isNaN(+value)) return 'should be a number';
      if (typeof greaterThan != undefined && +value <= greaterThan) return `should be greater than ${greaterThan}`;
    }
  };
}
