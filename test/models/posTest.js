const assert = require('chai').assert;
const getCoordinates = require('../../src/models/position_system.js');

describe('getCoordinates', function () {
  describe('south', function () {
    it('should give given no: of co-ordinates in south direction', function () {
      let coordinates = getCoordinates('south',[0,0],3);
      let expected = [[0,0],[0,1],[0,2]];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list when given length is 0', function () {
      let coordinates = getCoordinates('south',[1,0],0);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list when length is negative', function () {
      let coordinates = getCoordinates('south',[0,0],-2);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
  });
  describe('north', function () {
    it('should give given no: of co-ordinates in north direction', function () {
      let coordinates = getCoordinates('north',[0,0],3);
      let expected = [[0,0],[0,-1],[0,-2]];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list when given length is 0', function () {
      let coordinates = getCoordinates('north',[1,0],0);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list when length is negative', function () {
      let coordinates = getCoordinates('north',[0,0],-3);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
  });
  describe('west', function () {
    it('should give given no: of co-ordinates in west direction', function () {
      let coordinates = getCoordinates('west',[0,0],3);
      let expected = [[0,0],[-1,0],[-2,0]];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list when given length is 0', function () {
      let coordinates = getCoordinates('west',[0,0],0);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list when length is negative', function () {
      let coordinates = getCoordinates('west',[0,0],-1);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
  });
  describe('east', function () {
    it('should give given no: of co-ordinates in east direction', function () {
      let coordinates = getCoordinates('east',[0,0],3);
      let expected = [[0,0],[1,0],[2,0]];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list when given length is 0', function () {
      let coordinates = getCoordinates('east',[0,0],0);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
    it('should give empty list when length is negative', function () {
      let coordinates = getCoordinates('east',[0,0],-2);
      let expected = [];
      assert.deepEqual(coordinates,expected);
    });
  });
});
