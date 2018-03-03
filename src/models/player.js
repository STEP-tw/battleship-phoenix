class Player {
  constructor(id, name) {
    this._id = id;
    this._name = name;
    this._fleet = undefined;
    this._ready = false;
    this._shots = {
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
  isAlreadFired(pos) {
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
}

module.exports = Player;
