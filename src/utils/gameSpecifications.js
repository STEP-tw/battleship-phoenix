const gameSpecs = {};

gameSpecs.getShipSizes = function () {
  const shipSizes = {
    carrier: 5,
    destroyer: 2,
    submarine: 3,
    cruiser: 3,
    battleship: 4
  };
  return shipSizes;
};

gameSpecs.getDirections = function () {
  let validDirections = ["south", "west", "east", "north"];
  return validDirections;
};

gameSpecs.getShipLength = function(shipName) {
  let shipSizes = this.getShipSizes();
  return shipSizes[shipName];
};

module.exports = gameSpecs;
