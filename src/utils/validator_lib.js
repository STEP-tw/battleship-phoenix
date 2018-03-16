const getCoordinates = require('../models/position_system');
const gameSpecs = require('../utils/gameSpecifications.js');

const lib = {};

lib.randomIntBetween = function(min,max,random = Math.random){
  return Math.floor(random() * (max - min)) + min;
};


lib.inRange = function (lowerBdry,upperBdry,coord) {
  return coord >= lowerBdry && coord < upperBdry;
};

lib.isDuplicate = function (ele, index, arr){
  return arr.indexOf(ele) != index;
};

lib.hasDuplicates = function (array) {
  return array.some(this.isDuplicate);
};

lib.getShipDirection = function (ship) {
  return ship.direction;
};

lib.getShipName = function (ship){
  return ship.name;
};

lib.areSame = function (list1,list2) {
  return list1.length == list2.length &&
    list1.every(ele => list2.includes(ele));
};

lib.getAllShipCoordinate = function(allShips) {
  return allShips.reduce((allShipCoords,ship) => {
    let shipCoord = getCoordinates(ship.direction, ship.initialPos,
      gameSpecs.getShipLength(this.getShipName(ship)));
    //... refers to spread syntax.
    return [...allShipCoords,...shipCoord];
  },[]);
};

lib.doesShipsOverlap = function(allShips) {
  let allCoordinates = this.getAllShipCoordinate(allShips);
  let fleetCoords = allCoordinates.map((ele) => ele.join(''));
  return this.hasDuplicates(fleetCoords);
};

module.exports = lib;
