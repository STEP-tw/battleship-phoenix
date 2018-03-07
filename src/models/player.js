const Fleet = require('./fleet');
class Player {
  constructor(id, name,ships,ready,shots) {
    this._id = id;
    this._name = name;
    this._fleet = ships || new Fleet();
    this._ready = ready || false;
    this._shots = shots || {
      hits: [],
      misses: []
    };
  }
  get playerId() {
    return this._id;
  }
  get playerName() {
    return this._name;
  }
  changeStatus() {
    this._ready = !this._ready;
  }
  addFleet(fleet) {
    this._fleet = fleet;
  }
  getFleet() {
    return this._fleet;
  }
  isReady() {
    return this._ready;
  }
  hasFleetDestroyed() {
    return this._fleet.hasAllShipsSunk();
  }
  isHit(position) {
    return this._fleet.isAnyShipHit(position);
  }
  get shots() {
    return this._shots;
  }
  updateShot(type, position) {
    this._shots[type].push(position);
  }
  isItYourId(id) {
    return this._id == id;
  }
  isPosIncludesInShots(firedPos, shotType) {
    return this._shots[shotType].some((pos) => {
      return firedPos[0] == pos[0] && firedPos[1] == pos[1];
    });
  }
  isAlreadyFired(pos) {
    return this.isPosIncludesInShots(pos, "hits")
    || this.isPosIncludesInShots(pos, "misses");
  }
  getDestroyedShipsCoords(){
    let allShips = this._fleet.getAllSunkShips();
    let shipsCoords = [];
    allShips.forEach((ship)=>{
      shipsCoords.push(ship.getShipCoords());
    });
    return shipsCoords;
  }
  getLastShot(){
    let lastShot = this._lastShot;
    if(lastShot){
      delete this._lastShot;
    }
    return lastShot;
  }
  updateLastShot(shot,status){
    this._lastShot = {};
    this._lastShot.shot = shot;
    this._lastShot.status = status;
  }
}

module.exports = Player;
