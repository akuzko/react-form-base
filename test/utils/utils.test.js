import { fullPath, fullName } from '../../src/utils';
import expect from 'expect';

describe('fullPath', function() {
  it('generates a lodash path based on passed array', function() {
    expect(fullPath(['foo', 1, 'bar', 'baz'])).toEqual('foo[1].bar.baz');
  });
});
