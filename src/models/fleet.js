const Ship = require('./ship.js');

class Fleet {
  constructor() {
    this.ships = [];
  }
  addShip(direction,size,initialPos){
    let ship = new Ship(direction,size,initialPos);
    this.ships.push(ship);
  }
  getAllShips(){
    return this.ships;
  }
}

module.exports = Fleet;
