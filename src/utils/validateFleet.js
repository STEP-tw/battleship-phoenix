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
  return areAllValidShips(allShips) && isValidDirection(allShips)
        && isValidPosition(allShips) && !doesShipsOverlap(allShips);
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

const getAllShipsCoordinates=function(allShips){
  let allShipsCoordinates=[];
  allShips.forEach((ship)=>{
    let shipCoord=getCoordinates(ship.direction,ship.initialPos,ship.length);
    shipCoord.forEach((coord)=>{
      allShipsCoordinates.push(coord);
    });
  });
  return allShipsCoordinates;
};

const doesShipsOverlap = function(allShips){
  let allCoordinates=getAllShipsCoordinates(allShips);
  for(let index = 0; index < allCoordinates.length; index++){
    let remainingCoords = deleteAt(allCoordinates,index);
    for(let iterator = 0; iterator < remainingCoords.length; iterator++){
      if(areEqual(remainingCoords[iterator],allCoordinates[index])) {
        return true;
      }
    }
  }
  return false;
};

const deleteAt = function(list,posAt) {
  let newList = [];
  for(let index = 0; index < list.length; index++){
    if(index != posAt){
      newList.push(list[index]);
    }
  }
  return newList;
};

const areEqual = function(firstList, secondList) {
  for (let index = 0; index < firstList.length; index++) {
    if (firstList[index] != secondList[index]) {
      return false;
    }
  }
  return firstList.length == secondList.length;
};

module.exports={
  getShipLength:getShipLength,
  isShipAlreadyPresent:isShipAlreadyPresent,
  isValidFleet:isValidFleet,
  isValidDirection:isValidDirection,
  getShipLastCoord:getShipLastCoord,
  isValidPosition:isValidPosition,
  isShipInRange:isShipInRange,
  getShipLastCoord:getShipLastCoord,
  doesShipsOverlap:doesShipsOverlap,
  getAllShipsCoordinates:getAllShipsCoordinates,
  areEqual:areEqual,
  deleteAt:deleteAt
};
