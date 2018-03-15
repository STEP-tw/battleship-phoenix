const assert = require('chai').assert;
const Fleet = require('./../../src/models/fleet.js');

describe('Fleet', () => {
  describe('addShip', () => {
    it('should add a new ship with direction,head position and name', () => {
      let fleet=new Fleet();
      let shipInfo = {dir:'south',name:"cruiser",headPos:[1,2]};
      fleet.addShip(shipInfo);
      let actual=fleet.ships;
      let expected= [
        {direction:'south',length:3,name:"cruiser",
          initialPos:[1,2],posOfDamage:[]}];
      assert.deepEqual(actual, expected);
    });
  });
  describe('getter ships', () => {
    it('should give all the ships in the fleet', () => {
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',name:"cruiser",headPos:[1,2]};
      let subShipInfo = {dir:'south',name:"battleship",headPos:[2,3]};

      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      let expected= [
        {direction:'south',name:"cruiser",length:3
          ,initialPos:[1,2],posOfDamage:[]},
        {direction:'south',name:"battleship",length:4
          ,initialPos:[2,3],posOfDamage:[]}];
      assert.deepEqual(fleet.ships, expected);
    });
  });
  describe('isAnyShipHit', () => {
    it('should return true if any ship is hit ', () => {
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',name:"cruiser",headPos:[1,2]};
      let subShipInfo = {dir:'south',name:"battleship",headPos:[2,3]};
      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      let actual = fleet.isAnyShipHit([1,2]);
      assert.ok(actual);
    });
    it('should return false if any ship is not hit ', () => {
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',name:"cruiser",length:3,headPos:[1,2]};
      let subShipInfo = {dir:'south',name:"battleship",length:4,headPos:[2,3]};
      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      let actual = fleet.isAnyShipHit([3,2]);
      assert.isNotOk(actual);
    });
  });
  describe('hasAllShipSunk', () => {
    it('should return true if all ships are sunk ', () => {
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',name:"destroyer",headPos:[1,2]};
      fleet.addShip(carShipInfo);
      fleet.isAnyShipHit([1,2]);
      fleet.isAnyShipHit([1,3]);
      assert.ok(fleet.hasAllShipsSunk());
    });
    it('should return false if all ships are sunk ', () => {
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',name:'submarine',headPos:[1,2]};
      let subShipInfo = {dir:'south',name:'battleship',headPos:[2,3]};
      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      fleet.isAnyShipHit([3,2]);
      assert.isNotOk(fleet.hasAllShipsSunk());
    });
  });
  describe('shipsCount', () => {
    it('should return count of all ships', () => {
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',name:1,headPos:[1,2]};
      let subShipInfo = {dir:'south',name:4,headPos:[2,3]};
      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      assert.equal(fleet.shipsCount,2);
    });
  });

  describe('getAllSunkShips',()=>{
    it('should return [] when no ship is sunk',()=>{
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',name:'cruiser',headPos:[1,2]};
      let subShipInfo = {dir:'south',name:'battleship',headPos:[2,3]};
      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      assert.deepEqual(fleet.getAllSunkShips(),[]);
    });

    it('should return the ship that is sunk here cruiser',()=>{
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',name:'cruiser',
        headPos:[1,2],damages:[[1,2],[1,3],[1,4]]};
      let subShipInfo = {dir:'south',name:'battleship',
        headPos:[2,3]};
      let expected = [{direction:"south",initialPos:[1,2],length:3,
        name:"cruiser",posOfDamage:[[1,2],[1,3],[1,4]]}];
      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      assert.deepEqual(fleet.getAllSunkShips(),expected);
    });
  });

  describe('hasAllShipsSunk',()=>{
    it('should return true when all ships have not sunk',()=>{
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',name:'cruiser',
        headPos:[1,2],damages:[[1,2],[1,3],[1,4]]};
      let subShipInfo = {dir:'south',name:'battleship',
        headPos:[2,3],damages:[[2,3],[2,4],[2,5],[2,6]]};
      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      assert.isOk(fleet.hasAllShipsSunk());
    });

    it('should return false when all ships have not sunk',()=>{
      let fleet=new Fleet();
      let carShipInfo = {dir:'south',name:'cruiser',
        headPos:[1,2],damages:[[1,2],[1,3],[1,4]]};
      let subShipInfo = {dir:'south',name:'battleship',
        headPos:[2,3]};
      fleet.addShip(carShipInfo);
      fleet.addShip(subShipInfo);
      assert.isNotOk(fleet.hasAllShipsSunk());
    });
  });

});
