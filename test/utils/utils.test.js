import { nameToPath } from '../../src/utils';
import expect from 'expect';

describe('nameToPath', function() {
  it('generates a lodash path based on passed name', function() {
    expect(nameToPath('foo.1.bar.baz')).toEqual('foo[1].bar.baz');
  });
});
