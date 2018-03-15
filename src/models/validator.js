const gameSpecs = require('../utils/gameSpecifications.js');
const lib = require('../utils/validator_lib.js');

class Validator {
  constructor(lowerBdry,upperBdry,reqShipsCount) {
    this._lowerBoundary = lowerBdry;
    this._upperBoundary = upperBdry;
    this._reqShipsCount = reqShipsCount;
    this._validShipSizes = gameSpecs.getShipSizes();
    this._validDirections = gameSpecs.getDirections();
  }

  get lowerBoundary(){
    return this._lowerBoundary;
  }

  get upperBoundary(){
    return this._upperBoundary;
  }

  get reqShipsCount(){
    return this._reqShipsCount;
  }

  get validShipSizes(){
    return this._validShipSizes;
  }

  get validDirections(){
    return this._validDirections;
  }

  hasRequiredShips(fleet) {
    return this.reqShipsCount == fleet.length;
  }

  areShipNamesValid (fleet) {
    let validShipNames = Object.keys(this.validShipSizes);
    let actualShipNames = fleet.map(lib.getShipName);
    return lib.areSame(validShipNames,actualShipNames);
  }

  isValidFleet (allShips) {
    return this.areShipNamesValid(allShips)
    && this.areDirecsValid(allShips)
    && this.isValidFleetPositions(allShips)
    && (!lib.doesShipsOverlap(allShips));
  }

  areDirecsValid (fleet) {
    let currDirecs = fleet.map(lib.getShipDirection);
    let validDirecs = this.validDirections;
    return currDirecs.every(dir => validDirecs.includes(dir));
  }

  isValidFleetPositions (fleet) {
    let allShipsCoordinates = lib.getAllShipCoordinate(fleet);
    return allShipsCoordinates.every(this.isCoordInRange.bind(this));
  }

  isCoordInRange (coord) {
    let lb = this.lowerBoundary, ub = this.upperBoundary;
    return lib.inRange(lb,ub,coord[0]) && lib.inRange(lb,ub,coord[1]);
  }
}

module.exports = Validator;
