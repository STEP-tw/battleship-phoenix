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
  describe('hasAllShipSunk', () => {
    it('should return true if all ships are sunk ', () => {
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',length:1,headPos:[1,2]};
      fleet.addShip(carShipInfo);
      fleet.isAnyShipHit([1,2]);
      assert.ok(fleet.hasAllShipsSunk());
    });
    it('should return false if all ships are sunk ', () => {
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',length:3,headPos:[1,2]};
      let subShipInfo = {dir:'south',length:4,headPos:[2,3]};
      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      fleet.isAnyShipHit([3,2]);
      assert.isNotOk(fleet.hasAllShipsSunk());
    });
  });
  describe('shipsCount', () => {
    it('should return count of all ships', () => {
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',length:1,headPos:[1,2]};
      let subShipInfo = {dir:'south',length:4,headPos:[2,3]};
      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      assert.equal(fleet.shipsCount,2);
    });
  });
  describe('requiredShipsCount', () => {
    it('should return count of all required ships to make fleet', () => {
      let fleet=new Fleet([],4);
      assert.equal(fleet.requiredShipsCount,4);
      let otherFleet=new Fleet();
      assert.equal(otherFleet.requiredShipsCount,5);
    });
  });
  describe('hasRequiredShips', () => {
    it('should return true if shipsCount is equal to required ships', () => {
      let fleet=new Fleet([],1);
      let carrierInfo = {dir:'south',length:3,headPos:[1,2]};
      fleet.addShip(carrierInfo);
      let actual = fleet.hasRequiredShips();
      assert.ok(actual);
    });
    it('should return true if shipsCount is equal to required ships', () => {
      let fleet=new Fleet([],2);
      let carrierInfo = {dir:'south',length:3,headPos:[1,2]};
      let SubmarineInfo = {dir:'south',length:4,headPos:[2,3]};
      let battleInfo = {dir:'south',length:3,headPos:[1,2]};
      fleet.addShip(carrierInfo);
      fleet.addShip(SubmarineInfo);
      fleet.addShip(battleInfo);
      let actual = fleet.hasRequiredShips();
      assert.isNotOk(actual);
    });
  });
});
