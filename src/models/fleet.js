const Ship = require('./ship.js');


class Fleet {
  constructor(ships, shipsCount=5) {
    this._ships = ships || [];
    this._requiredShipsCount=shipsCount;
  }
  addShip(shipInfo){
    let ship = new Ship(shipInfo.dir,shipInfo.name,shipInfo.headPos);
    this._ships.push(ship);
  }
  get shipsCount(){
    return this._ships.length;
  }
  getAllShips(){
    return this._ships;
  }
  hasAllShipsSunk(){
    return this._ships.every(function(ship){
      return ship.isSunk();
    });
  }
  getAllSunkShips(){
    let allSunkShips = this._ships.filter((ship)=>{
      return ship.isSunk() ;
    });
    return allSunkShips;
  }
  hasRequiredShips(){
    return this.shipsCount==this.requiredShipsCount;
  }
  get requiredShipsCount(){
    return this._requiredShipsCount;
  }
  isAnyShipHit(position){
    return this._ships.some(function(ship){
      return ship.isHit(position);
    });
  }
}

module.exports = Fleet;
