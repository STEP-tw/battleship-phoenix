const Ship = require('./ship.js');

class Fleet {
  constructor() {
    this.ships = [];
  }
  addShip(shipInfo){
    let ship = new Ship(shipInfo.dir,shipInfo.size,shipInfo.headPos);
    this.ships.push(ship);
  }
  getAllShips(){
    return this.ships;
  }
}

module.exports = Fleet;
