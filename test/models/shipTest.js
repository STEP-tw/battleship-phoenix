const assert = require('chai').assert;
const Ship = require('./../../src/models/ship.js');


describe('Ship', () => {
  describe('addShip', () => {
    it('should give the list of the positions', () => {
      let ship=new Ship('south',"cruiser",[1,2]);
      let actual=ship.getShipCoords();
      let expected= [[1,2],[1,3],[1,4]];
      assert.deepEqual(actual, expected);
    });
  });
  describe('updateDamage', () => {
    it('should update the damage positions of ship', () => {
      let ship=new Ship('south',3,[1,2]);
      ship.updateDamage([1,2]);
      let actual=ship.posOfDamage;
      let expected= [[1,2]];
      assert.deepEqual(actual, expected);
    });
    it('should not update the damage positions when it is already present',
      () => {
        let ship=new Ship('south',3,[1,2]);
        ship.updateDamage([1,2]);
        ship.updateDamage([1,2]);
        let actual=ship.posOfDamage;
        let expected= [[1,2]];
        assert.deepEqual(actual, expected);
      });
  });
  describe('isHit', () => {
    it('should return true if the ship is hit', () => {
      let ship=new Ship('south',"cruiser",[1,2]);
      let actual=ship.isHit([1,2]);
      assert.ok(actual);
    });
    it('should return false if the ship is not hit', () => {
      let ship=new Ship('south',"cruiser",[1,2]);
      let actual=ship.isHit([2,2]);
      assert.isNotOk(actual);
    });
  });
  describe('isSunk', () => {
    it('should return true if the ship  sunk', () => {
      let ship=new Ship('south',"cruiser",[3,2]);
      ship.updateDamage([3,2]);
      ship.updateDamage([4,2]);
      ship.updateDamage([5,2]);
      assert.ok(ship.isSunk());
    });
    it('should return false if the ship is not sunk', () => {
      let ship=new Ship('south',"cruiser",[1,2]);
      ship.updateDamage([2,2]);
      assert.isNotOk(ship.isSunk());
    });
  });
  describe('isAlreadyHit', () => {
    it('should return true if shot was already made', () => {
      let ship=new Ship('south',"cruiser",[3,2]);
      ship.updateDamage([3,2]);
      ship.updateDamage([4,2]);
      ship.updateDamage([5,2]);
      assert.ok(ship.isAlreadyHit([3,2]));
    });
    it('should return false if shot was not made', () => {
      let ship=new Ship('south',"cruiser",[1,2]);
      ship.updateDamage([2,2]);
      assert.ok(ship.isAlreadyHit([2,2]));
    });
  });
});
