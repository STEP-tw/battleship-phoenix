const assert = require('chai').assert;
const Fleet = require('./../../src/models/fleet.js');

describe('Fleet', () => {
  describe('addShip', () => {
    it('should add a new ship with direction,head position and length', () => {
      let fleet=new Fleet();
      let shipInfo = {dir:'south',length:3,headPos:[1,2]};
      fleet.addShip(shipInfo);
      let actual=fleet.getAllShips();
      let expected= [
        {direction:'south',length:3,initialPos:[1,2],posOfDamage:[]}];
      assert.deepEqual(actual, expected);
    });
  });
  describe('getAllShips', () => {
    it('should give all the ships in the fleet', () => {
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',length:3,headPos:[1,2]};
      let subShipInfo = {dir:'south',length:4,headPos:[2,3]};

      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      let actual=fleet.getAllShips();
      let expected= [
        {direction:'south',length:3,initialPos:[1,2],posOfDamage:[]},
        {direction:'south',length:4,initialPos:[2,3],posOfDamage:[]}];
      assert.deepEqual(actual, expected);
    });
  });
  describe('isAnyShipHit', () => {
    it('should return true if any ship is hit ', () => {
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',length:3,headPos:[1,2]};
      let subShipInfo = {dir:'south',length:4,headPos:[2,3]};
      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      let actual = fleet.isAnyShipHit([1,2]);
      assert.ok(actual);
    });
    it('should return false if any ship is not hit ', () => {
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',length:3,headPos:[1,2]};
      let subShipInfo = {dir:'south',length:4,headPos:[2,3]};
      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      let actual = fleet.isAnyShipHit([3,2]);
      assert.isNotOk(actual);
    });
  });
});
