const Ship = require('./ship.js');


class Fleet {
  constructor(ships, shipsCount=5) {
    this._ships = ships || [];
  }
  addShip(shipInfo){
    let damages = shipInfo.damages || [];
    let ship = new Ship(shipInfo.dir,shipInfo.name,
      shipInfo.headPos,damages);
    this._ships.push(ship);
  }
  get shipsCount(){
    return this.ships.length;
  }

  get ships(){
    return this._ships;
  }

  hasAllShipsSunk(){
    return this.ships.every(ship=>ship.isSunk());
  }
  getAllSunkShips(){
    return this.ships.filter(ship=>ship.isSunk());
  }

  isAnyShipHit(position){
    return this.ships.some(ship=>ship.isHit(position));
  }
}

module.exports = Fleet;
