const getCoordinates = require('../models/position_system');

const lowerBoundary = 0;
const upperBoundary = 10;
const shipLength={
  carrier:5,
  destroyer:2,
  submarine:3,
  cruiser:3,
  battleship:4
};
const isValidFleet=function(allShips){
  return areAllValidShips(allShips) &&
          isValidDirection(allShips) && isValidPosition(allShips) ;
};
const getShipLength=function(shipName){
  return shipLength[shipName];
};
const areAllValidShips=function(fleet){
  let shipNames=Object.keys(shipLength);
  return fleet.every((ship)=>{
    return shipNames.includes(ship.name);
  });
};

const isValidDirection=function(fleet){
  let validDirection=["south","west","east","north"];
  return fleet.every((ship)=>{
    return validDirection.includes(ship.direction);
  });
};

const isValidPosition=function(fleet){
  let allShipsLastPos = fleet.map(getShipLastCoord);
  return allShipsLastPos.every(isShipInRange);
};

const getShipLastCoord=function(ship){
  let allCoordinates=getCoordinates(ship.direction,ship.initialPos,ship.length);
  return allCoordinates[ship.length-1];
};


const isShipInRange = function(lastCoord) {
  return lastCoord[1] < upperBoundary && lastCoord[1] >= lowerBoundary
  && lastCoord[0] >= lowerBoundary && lastCoord[0] < upperBoundary;
};


const isShipAlreadyPresent=function(allShips,newShip){
  return allShips.some((ship)=>{
    return ship.name==newShip.name;
  });
};
module.exports={
  getShipLength:getShipLength,
  isShipAlreadyPresent:isShipAlreadyPresent,
  isValidFleet:isValidFleet,
  isValidDirection:isValidDirection,
  getShipLastCoord:getShipLastCoord,
  isValidPosition:isValidPosition,
  isShipInRange:isShipInRange,
  getShipLastCoord:getShipLastCoord
};