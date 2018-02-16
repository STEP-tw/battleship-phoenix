const assert = require('chai').assert;
const positionSystem = require('../../src/models/position_system.js');

describe('positionSystem', function () {
  describe('south', function () {
    it('should give given no: of co-ordinates in south direction', function () {
      let coordinates = positionSystem.south('og_0_0',3);
      let expected = [[0,0],[0,1],[0,2]];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list if given length is 0', function () {
      let coordinates = positionSystem.south('og_0_0',0);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list if length is negative', function () {
      let coordinates = positionSystem.south('og_0_0',-2);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
  });
  describe('north', function () {
    it('should give given no: of co-ordinates in north direction', function () {
      let coordinates = positionSystem.north('og_0_0',3);
      let expected = [[0,0],[0,-1],[0,-2]];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list if given length is 0', function () {
      let coordinates = positionSystem.north('og_0_0',0);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list if length is negative', function () {
      let coordinates = positionSystem.north('og_0_0',-3);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
  });
  describe('west', function () {
    it('should give given no: of co-ordinates in west direction', function () {
      let coordinates = positionSystem.west('og_0_0',3);
      let expected = [[0,0],[-1,0],[-2,0]];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list if given length is 0', function () {
      let coordinates = positionSystem.west('og_0_0',0);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list if length is negative', function () {
      let coordinates = positionSystem.west('og_0_0',-1);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
  });
  describe('east', function () {
    it('should give given no: of co-ordinates in east direction', function () {
      let coordinates = positionSystem.east('og_0_0',3);
      let expected = [[0,0],[1,0],[2,0]];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list if given length is 0', function () {
      let coordinates = positionSystem.east('og_0_0',0);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list if length is negative', function () {
      let coordinates = positionSystem.east('og_0_0',-2);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
  });
});
