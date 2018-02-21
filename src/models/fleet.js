const Ship = require('./ship.js');

class Fleet {
  constructor() {
    this.ships = [];
  }
  addShip(shipInfo){
    let ship = new Ship(shipInfo.dir,shipInfo.length,shipInfo.headPos);
    this.ships.push(ship);
  }
  getAllShips(){
    return this.ships;
  }
  isAnyShipHit(position){
    return this.ships.some(function(ship){
      return ship.isHit(position);
    });
  }
}

module.exports = Fleet;
