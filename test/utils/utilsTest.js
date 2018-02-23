const assert = require('chai').assert;
const utils = require('./../../src/utils/utils.js');

describe('changeIndex', function () {
  it('should changeIndex from 1 to 0 and vice versa', function () {
    assert.deepEqual(utils.changeIndex(0),1);
    assert.deepEqual(utils.changeIndex(1),0);
  });
});
describe('generateTurn', function () {
  it('should give 1 or 2 in random', function () {
    assert.deepEqual(utils.generateTurn(0.4), [0,1]);
    assert.deepEqual(utils.generateTurn(0.6), [1,0]);
  });
});
