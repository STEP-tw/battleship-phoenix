const assert = require('chai').assert;
const Fleet = require('./../../src/models/fleet.js');

describe('Fleet', () => {
  describe('addShip', () => {
    it('should add a new ship with direction,head position and size', () => {
      let fleet=new Fleet();
      fleet.addShip('south',3,'og_1_2');
      let actual=fleet.getAllShips();
      let expected= [
        {direction:'south',size:3,initialPos:'og_1_2',posOfDamage:[]}];
      assert.deepEqual(actual, expected);
    });
  });
  describe('getAllShips', () => {
    it('should give all the ships in the fleet', () => {
      let fleet=new Fleet();
      fleet.addShip('south',3,'og_1_2');
      fleet.addShip('south',4,'og_6_2');
      let actual=fleet.getAllShips();
      let expected= [
        {direction:'south',size:3,initialPos:'og_1_2',posOfDamage:[]},
        {direction:'south',size:4,initialPos:'og_6_2',posOfDamage:[]}];
      assert.deepEqual(actual, expected);
    });
  });
});
