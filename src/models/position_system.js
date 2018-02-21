
//     N
// W <-+-> E
//     S

const getSouthCoordinates = (initialPos,length)=>{
  let coords = parseCoordinates(initialPos);
  let xCoord = coords[0];
  let yCoord = coords[1];
  let occupiedCoords = [];

  for (let iter = 0; iter < length; iter++) {
    let pos = [];
    pos.push(+xCoord,yCoord++);
    occupiedCoords.push(pos);
  }
  return occupiedCoords;
};

const getNorthCoordinates = (initialPos,length)=>{
  let coords = parseCoordinates(initialPos);
  let xCoord = coords[0];
  let yCoord = coords[1];
  let occupiedCoords = [];
  for (let iter = 0; iter < length; iter++) {
    let pos = [];
    pos.push(+xCoord,yCoord--);
    occupiedCoords.push(pos);
  }
  return occupiedCoords;
};

const getEastCoordinates = (initialPos,length)=>{
  let coords = parseCoordinates(initialPos);
  let xCoord = coords[0];
  let yCoord = coords[1];
  let occupiedCoords = [];
  for (let iter = 0; iter < length; iter++) {
    let pos = [];
    pos.push(xCoord++,+yCoord);
    occupiedCoords.push(pos);
  }
  return occupiedCoords;
};

const getWestCoordinates = (initialPos,length)=>{
  let coords = parseCoordinates(initialPos);
  let xCoord = coords[0];
  let yCoord = coords[1];
  let occupiedCoords = [];
  for (let iter = 0; iter < length; iter++) {
    let pos = [];
    pos.push(xCoord--,+yCoord);
    occupiedCoords.push(pos);
  }
  return occupiedCoords;
};

const parseCoordinates = (cellId)=>{
  let coords = cellId.split('_').slice(1);
  return coords;
};

let positionSystem = {
  'south': getSouthCoordinates,
  'north': getNorthCoordinates,
  'west': getWestCoordinates,
  'east': getEastCoordinates
};

module.exports = positionSystem;
