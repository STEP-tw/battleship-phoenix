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
        && isValidFleetPositions(allShips) && !doesShipsOverlap(allShips);
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

const isValidFleetPositions=function(fleet){
  let allShipsCoordinates = getAllShipsCoordinates(fleet);
  return allShipsCoordinates.every(isCoordInRange);
};

const isCoordInRange = function(coord) {
  return coord[1] < upperBoundary && coord[1] >= lowerBoundary
  && coord[0] >= lowerBoundary && coord[0] < upperBoundary;
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
  let fleetCoords = allCoordinates.map((ele)=>ele.join(''));
  return fleetCoords.some((ele,index)=>{
    return fleetCoords.indexOf(ele) != index;
  });
};

module.exports={
  getShipLength,
  isShipAlreadyPresent,
  isValidFleet,
  isValidDirection,
  isValidFleetPositions,
  isCoordInRange,
  doesShipsOverlap,
  getAllShipsCoordinates
};
