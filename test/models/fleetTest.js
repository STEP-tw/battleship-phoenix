const assert = require('chai').assert;
const Fleet = require('./../../src/models/fleet.js');

describe('Fleet', () => {
  describe('addShip', () => {
    it('should add a new ship with direction,head position and size', () => {
      let fleet=new Fleet();
      let shipInfo = {dir:'south',size:3,headPos:'og_1_2'};
      fleet.addShip(shipInfo);
      let actual=fleet.getAllShips();
      let expected= [
        {direction:'south',size:3,initialPos:'og_1_2',posOfDamage:[]}];
      assert.deepEqual(actual, expected);
    });
  });
  describe('getAllShips', () => {
    it('should give all the ships in the fleet', () => {
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',size:3,headPos:'og_1_2'};
      let subShipInfo = {dir:'south',size:4,headPos:'og_6_2'};

      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      let actual=fleet.getAllShips();
      let expected= [
        {direction:'south',size:3,initialPos:'og_1_2',posOfDamage:[]},
        {direction:'south',size:4,initialPos:'og_6_2',posOfDamage:[]}];
      assert.deepEqual(actual, expected);
    });
  });
});
