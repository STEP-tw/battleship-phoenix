const assert = require('chai').assert;
const turnGenerator = require('./../../src/utils/turnGenerator.js');
const changeIndex = turnGenerator.changeIndex;
const generateTurn = turnGenerator.generateTurn;

describe('changeIndex', function() {
  it('should changeIndex from 1 to 0 and vice versa', function() {
    assert.deepEqual(changeIndex(0), 1);
    assert.deepEqual(changeIndex(1), 0);
  });
});

describe('generateTurn', function() {
  it('should give 1 or 2 in random', function() {
    assert.deepEqual(generateTurn(0.4), [0, 1]);
    assert.deepEqual(generateTurn(0.6), [1, 0]);
  });
});
