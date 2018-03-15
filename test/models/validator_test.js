const assert = require('chai').assert;
const Validator = require('./../../src/models/validator.js');


describe('Validator',function(){
  let validator;
  beforeEach(()=>{
    validator = new Validator(0,10,5);
  });

  describe('isValidFleetPositions', function () {
    it('should return false when any ship position is out of range',
      function () {
        let fleet=[{direction:"south",initialPos:[10,10],name:'cruiser'},
          {direction:"north",initialPos:[9,-5],name:'cruiser'}];
        assert.isNotOk(validator.isValidFleetPositions(fleet));
      });
    it('should return true when all ships positions is in the range',
      function () {
        let fleet=[{direction:"south",initialPos:[2,5],name:'cruiser'},
          {direction:"north",initialPos:[6,5],name:'submarine'}];
        assert.isOk(validator.isValidFleetPositions(fleet));
      });
  });

  describe('isValidFleet', function () {
    it(`should return false when ship have invalid
      direction and valid position`,function () {
      let fleet=[{direction:"south-west",initialPos:[2,3],length:3,
        name:"carrier"}];
      assert.isNotOk(validator.isValidFleet(fleet));
    });
    it(`should return false when ship have invalid
      position and valid direction`, function () {
      let fleet=[{direction:"south",initialPos:[10,10],length:3,
        name:"carrier"}];
      assert.isNotOk(validator.isValidFleet(fleet));
    });
    it(`should return false when ship have invalid
      position and invalid direction`, function () {
      let fleet=[{direction:"south-west",initialPos:[10,10],length:3,
        name:"carrier"}];
      assert.isNotOk(validator.isValidFleet(fleet));
    });
    it(`should return true when ship have valid direction and valid position`,
      function () {
        let fleet=[{direction:"south",initialPos:[2,5],name:'cruiser'},
          {direction:"north",initialPos:[6,4],name:'submarine'},
          {direction:"south",initialPos:[6,5],name:'carrier'},
          {direction:"south",initialPos:[3,5],name:'battleship'},
          {direction:"south",initialPos:[8,5],name:'destroyer'}];
        assert.isOk(validator.isValidFleet(fleet));
      });
  });

  describe('areDirecsValid', function () {
    it(
      'should return false when any ship direction is invalid',
      function () {
        let fleet=[{direction:"south",initialPos:[2,5],length:3},
          {direction:"north-west",initialPos:[2,5],length:3}];
        assert.isNotOk(validator.areDirecsValid(fleet));
      });
    it('should return true when all ship directions are valid',
      function () {
        let fleet=[{direction:"south",initialPos:[2,5],length:3},
          {direction:"north",initialPos:[2,5],length:3}];
        assert.isOk(validator.areDirecsValid(fleet));
      });
  });
  it('validator.lowerBoundary should return 0',()=>{
    assert.equal(validator.lowerBoundary,0);
  });
  it('validator.upperBoundary should return 0',()=>{
    assert.equal(validator.upperBoundary,10);
  });
  it('validator.reqShipsCount should return 0',()=>{
    assert.equal(validator.reqShipsCount,5);
  });
  it('validator.validShipSizes should return validShipSizes',()=>{
    let expected = {carrier : 5, battleship : 4,
      cruiser : 3, submarine : 3, destroyer : 2};
    assert.deepEqual(validator.validShipSizes,expected);
  });
  it('validator.validDirections should return validShipSizes',()=>{
    let expected = ["south", "west", "east", "north"];
    assert.deepEqual(validator.validDirections,expected);
  });

  describe('hasRequiredShips',()=>{
    it('should return true when fleet has 5 ships',()=>{
      assert.isOk(validator.hasRequiredShips([1,2,3,4,5]));
    });
    it('should return false when fleet has more or less than 5 ships',()=>{
      assert.isNotOk(validator.hasRequiredShips([1,2,3,4]));
      assert.isNotOk(validator.hasRequiredShips([1,2,3,4,5,6]));
    });
  });

  describe('isCoordInRange',()=>{
    it('Should return true when coordinate is in grid',()=>{
      assert.isOk(validator.isCoordInRange([0,0]));
      assert.isOk(validator.isCoordInRange([9,9]));
      assert.isOk(validator.isCoordInRange([0,9]));
      assert.isOk(validator.isCoordInRange([9,0]));
      assert.isOk(validator.isCoordInRange([4,5]));
    });

    it('Should return false when coordinate is not in grid',()=>{
      assert.isNotOk(validator.isCoordInRange([-1,0]));
      assert.isNotOk(validator.isCoordInRange([9,10]));
      assert.isNotOk(validator.isCoordInRange([30,9]));
      assert.isNotOk(validator.isCoordInRange([-4,-5]));
    });
  });

  describe('areShipNamesValid',()=>{
    it(`should return true when ship names are distinct and
      does not have any invalid ship`,()=>{
      let fleet=[{direction:"south",initialPos:[2,5],name:'cruiser'},
        {direction:"north",initialPos:[6,4],name:'submarine'},
        {direction:"south",initialPos:[6,5],name:'carrier'},
        {direction:"south",initialPos:[3,5],name:'battleship'},
        {direction:"south",initialPos:[8,5],name:'destroyer'}];
      assert.isOk(validator.areShipNamesValid(fleet));
    });

    it(`should return false when ship names are not distinct and
      does not have any invalid ship`,()=>{
      let fleet=[{direction:"south",initialPos:[2,5],name:'carrier'},
        {direction:"north",initialPos:[6,4],name:'battleship'},
        {direction:"south",initialPos:[6,5],name:'cruiser'},
        {direction:"south",initialPos:[2,5],name:'cruiser'},
        {direction:"south",initialPos:[2,5],name:'destroyer'}];
      assert.isNotOk(validator.areShipNamesValid(fleet));
    });

    it(`should return false when ship names are distinct and
      does not have any invalid ship`,()=>{
      let fleet=[{direction:"south",initialPos:[2,5],name:'carrier'},
        {direction:"north",initialPos:[6,4],name:'battleship'},
        {direction:"south",initialPos:[6,5],name:'myship'},
        {direction:"south",initialPos:[2,5],name:'cruiser'},
        {direction:"south",initialPos:[2,5],name:'destroyer'}];
      assert.isNotOk(validator.areShipNamesValid(fleet));
    });

    it(`should return false when ship names are not distinct and
      has invalid ship`,()=>{
      let fleet=[{direction:"south",initialPos:[2,5],name:'carrier'},
        {direction:"north",initialPos:[6,4],name:'battleship'},
        {direction:"south",initialPos:[6,5],name:'cruiser'},
        {direction:"south",initialPos:[2,5],name:'myship'},
        {direction:"south",initialPos:[2,5],name:'destroyer'},
        {direction:"south",initialPos:[2,5],name:'destroyer'}];
      assert.isNotOk(validator.areShipNamesValid(fleet));
    });

    it(`should return false when ship names are not distinct and
      has four ships`,()=>{
      let fleet=[{direction:"south",initialPos:[2,5],name:'carrier'},
        {direction:"north",initialPos:[6,4],name:'battleship'},
        {direction:"south",initialPos:[6,5],name:'cruiser'},
        {direction:"south",initialPos:[2,5],name:'destroyer'}];
      assert.isNotOk(validator.areShipNamesValid(fleet));
    });
  });
});
