const getCoordinates = function(direction, initialPos, length) {
  let occupiedCoords = [];
  let xCoord = initialPos[0];
  let yCoord = initialPos[1];
  for (let iter = 0; iter < length; iter++) {
    let pos = [xCoord, yCoord];
    occupiedCoords.push(pos);
    pos = getNextCoordinate[direction](xCoord, yCoord);
    xCoord = pos[0];
    yCoord = pos[1];
  }
  return occupiedCoords;
};

const getNextCoordinate = {
  'south': (xCoord, yCoord) => [xCoord, yCoord + 1],
  'north': (xCoord, yCoord) => [xCoord, yCoord - 1],
  'east': (xCoord, yCoord) => [xCoord + 1, yCoord],
  'west': (xCoord, yCoord) => [xCoord - 1, yCoord]
};

module.exports = getCoordinates;
