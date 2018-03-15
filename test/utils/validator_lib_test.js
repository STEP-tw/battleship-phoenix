const lib = require('../../src/utils/validator_lib.js');
const assert = require('chai').assert;

describe('Validator lib',()=>{
  describe('lib.inRange(upperBdry,lowerBdry,value)',()=>{
    it('should return true when input is (0,10,2)',()=>{
      assert.isOk(lib.inRange(0,10,2));
    });

    it('should return false when input is (0,10,-1)',()=>{
      assert.isNotOk(lib.inRange(0,10,-1));
    });

    it('should return false when input is (0,10,24)',()=>{
      assert.isNotOk(lib.inRange(0,10,24));
    });

    it('should return true when input is (0,10,0)',()=>{
      assert.isOk(lib.inRange(0,10,0));
    });

    it('should return false when input is (0,10,10)',()=>{
      assert.isNotOk(lib.inRange(0,10,10));
    });
  });
  describe('lib.isDuplicate(ele,indexofEle,array)',()=>{
    it(`should return true when element's index in list
    is different from index`,()=>{
      assert.isOk(lib.isDuplicate(12,3,[1,12,3]));
    });

    it(`should return false when element's index in list
    is same as index`,()=>{
      assert.isNotOk(lib.isDuplicate(12,3,[1,1,3,12]));
    });

    it(`should return true when element's not present in list
    `,()=>{
      assert.isOk(lib.isDuplicate(0,3,[1,1,3,12]));
    });
  });

  describe('hasDuplicates',()=>{
    it(`should return true when list has any one
      element occurring more than once`,()=>{
      assert.isOk(lib.hasDuplicates([1,2,1,23]));
    });
    it(`should return true when list has none of elements
      occurring more than once`,()=>{
      assert.isNotOk(lib.hasDuplicates([2,1,23]));
    });
  });

  describe('lib.areSame(list1,list2)',()=>{
    it(`should return true when both lists
    have similar elements in same order`,()=>{
      assert.isOk(lib.areSame([1,2,3],[1,2,3]));
    });

    it(`should return true when both lists
    have similar elements in different order`,()=>{
      assert.isOk(lib.areSame([1,2,3,4],[2,1,4,3]));
    });

    it(`should return false when both lists
    have different elements`,()=>{
      assert.isNotOk(lib.areSame([1,2,3,4],[12,34]));
    });
  });

  describe('lib.getAllShipCoordinate', function () {
    it('should return coordinates of all ships', function () {
      let fleet=[{direction:"south",initialPos:[2,5],name:'cruiser'},
        {direction:"south",initialPos:[6,5],name:'submarine'}];
      let expected = [[2,5],[2,6],[2,7],[6,5],[6,6],[6,7]];
      assert.deepEqual(lib.getAllShipCoordinate(fleet),expected);
    });
  });

  describe('doesShipsOverlap', function () {
    it('should return true when ships overlap', function () {
      let fleet=[{direction:"south",initialPos:[2,5],name:'cruiser'},
        {direction:"south",initialPos:[6,5],name:'carrier'},
        {direction:"south",initialPos:[2,5],name:'submarine'}];
      assert.isOk(lib.doesShipsOverlap(fleet));
    });

    it('should return false when ship does not overlap', function () {
      let fleet=[{direction:"south",initialPos:[2,5],name:'cruiser'},
        {direction:"north",initialPos:[6,4],name:'submarine'},
        {direction:"south",initialPos:[6,5],name:'carrier'},
        {direction:"south",initialPos:[3,5],name:'battleship'},
        {direction:"south",initialPos:[8,5],name:'destroyer'}];
      assert.isNotOk(lib.doesShipsOverlap(fleet));
    });
  });

  it('lib.getShipDirection should return ship direction on given a ship',()=>{
    let ship = {name:'carrier',direction:'north'};
    assert.deepEqual(lib.getShipDirection(ship),'north');
  });

  it('lib.getShipName should return ship name on given a ship',()=>{
    let ship = {name:'carrier',direction:'north'};
    assert.deepEqual(lib.getShipName(ship),'carrier');
  });

});
