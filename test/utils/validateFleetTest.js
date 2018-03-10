const assert = require('chai').assert;
const validator = require('./../../src/utils/validateFleet.js');

describe('isValidDirection', function () {
  it(
    'should return false when any ship direction is invalid',
    function () {
      let fleet=[{direction:"south",initialPos:[2,5],length:3},
        {direction:"north-west",initialPos:[2,5],length:3}];
      assert.isNotOk(validator.isValidDirection(fleet));
    });
  it('should return true when all ship directions are valid',
    function () {
      let fleet=[{direction:"south",initialPos:[2,5],length:3},
        {direction:"north",initialPos:[2,5],length:3}];
      assert.isOk(validator.isValidDirection(fleet));
    });
});

describe('isValidPosition', function () {
  it('should return false when any ship position is out of range', function () {
    let fleet=[{direction:"south",initialPos:[10,10],length:3},
      {direction:"north",initialPos:[9,-5],length:3}];
    assert.isNotOk(validator.isValidPosition(fleet));
  });
  it('should return true when all ships positions is in the range',
    function () {
      let fleet=[{direction:"south",initialPos:[2,5],length:3},
        {direction:"north",initialPos:[6,5],length:3}];
      assert.isOk(validator.isValidPosition(fleet));
    });
});


describe('isShipAlreadyPresent', function () {
  it('should return false when ship is not in the fleet', function () {
    let fleet=[{direction:"south",initialPos:[10,10],length:3,name:"carrier"}];
    let expected = {direction:"south",initialPos:[10,10],length:3,
      name:"battleship"};
    assert.isNotOk(validator.isShipAlreadyPresent(fleet,expected));
  });
  it('should return true when ship is already in the fleet', function () {
    let expected = {direction:"north",initialPos:[6,5],length:3,name:"carrier"};
    let fleet=[{direction:"south",initialPos:[2,5],length:3,name:"carrier"},
      {direction:"south",initialPos:[2,5],length:3,name:"battleship"},];
    assert.isOk(validator.isShipAlreadyPresent(fleet,expected));
  });
});

describe('getShipLastCoord', function () {
  it('should return last coordinate of ship based on length,dir and headPos',
    function () {
      let destroyer={direction:"south",initialPos:[4,4],length:2};
      let battleship={direction:"north",initialPos:[2,3],length:4};
      let carrier={direction:"west",initialPos:[8,3],length:5,name:"carrier"};
      assert.deepEqual(validator.getShipLastCoord(destroyer),[4,5]);
      assert.deepEqual(validator.getShipLastCoord(battleship),[2,0]);
      assert.deepEqual(validator.getShipLastCoord(carrier),[4,3]);
    });
});

describe('getShipLength', function () {
  it('should give length of ship when it is a valid ship ', function () {
    assert.equal(validator.getShipLength("destroyer"),2);
    assert.equal(validator.getShipLength("meriship"),undefined);
  });
});

describe('isValidFleet', function () {
  it('should return false when ship have invalid direction and valid position',
    function () {
      let fleet=[{direction:"south-west",initialPos:[2,3],length:3,
        name:"carrier"}];
      assert.isNotOk(validator.isValidFleet(fleet));
    });
  it('should return false when ship have invalid position and valid direction',
    function () {
      let fleet=[{direction:"south",initialPos:[10,10],length:3,
        name:"carrier"}];
      assert.isNotOk(validator.isValidFleet(fleet));
    });
  it('should return false when ship have invalid position & invalid direction',
    function () {
      let fleet=[{direction:"south-west",initialPos:[10,10],length:3,
        name:"carrier"}];
      assert.isNotOk(validator.isValidFleet(fleet));
    });
  it('should return true when ship have valid direction and valid position',
    function () {
      let fleet=[{direction:"south",initialPos:[2,5],length:3,name:"carrier"}];
      assert.isOk(validator.isValidFleet(fleet));
    });
});

describe('getAllShipsCoordinates', function () {
  it('should return coordinates of all ships', function () {
    let fleet=[{direction:"south",initialPos:[2,5],length:3},
      {direction:"south",initialPos:[6,5],length:3}];
    let expected = [[2,5],[2,6],[2,7],[6,5],[6,6],[6,7]];
    assert.deepEqual(validator.getAllShipsCoordinates(fleet),expected);
  });
});

describe('doesShipsOverlap', function () {
  it('should return true when ships overlap', function () {
    let fleet=[{direction:"south",initialPos:[2,5],length:3},
      {direction:"south",initialPos:[6,5],length:3},
      {direction:"south",initialPos:[2,5],length:3}];
    assert.isOk(validator.doesShipsOverlap(fleet));
  });

  it('should return false when ship does not overlap', function () {
    let fleet=[{direction:"south",initialPos:[2,5],length:3},
      {direction:"north",initialPos:[6,5],length:3}];
    assert.isNotOk(validator.doesShipsOverlap(fleet));
  });
});


describe('areEqual', function () {
  it('should return true when lists are [1,2],[1,2]',function(){
    assert.isOk(validator.areEqual([1,2],[1,2]));
  });

  it('should return false when lists are [2,1],[1,2]',function(){
    assert.isNotOk(validator.areEqual([2,1],[1,2]));
  });

  it('should return false when lists are [2,2,3],[1,2]',function(){
    assert.isNotOk(validator.areEqual([2,2,3],[1,2]));
  });

  it('should return false when lists are [1,4],[5,2]',function(){
    assert.isNotOk(validator.areEqual([1,4],[5,2]));
  });
});

describe('deleteAt', function () {
  it('should return [1,2,3] when given list is [1,2,4,3] at 2', function () {
    assert.deepEqual(validator.deleteAt([1,2,4,3],2),[1,2,3]);
  });
  it('should return [[1,2],[1,1]] when given list is [[1,2],[4,3],[1,1]] at 1',
    function () {
      assert.deepEqual(validator.deleteAt([[1,2],[4,3],[1,1]],1),[[1,2],[1,1]]);
    });
  it('should return [1,2,3] when given list is [1,2,4,3] at 4', function () {
    assert.deepEqual(validator.deleteAt([1,2,4,3],4),[1,2,4,3]);
  });
});
