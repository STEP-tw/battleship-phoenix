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
  let validDirections = ['north','south','west','east'];
  return validDirections;
};

gameSpecs.getShipLength = function(shipName) {
  let shipSizes = this.getShipSizes();
  return shipSizes[shipName];
};

gameSpecs.getShipNames = function () {
  let shipNames = [
    {name:'carrier'},
    {name:'cruiser'},
    {name:'destroyer'},
    {name:'battleship'},
    {name:'submarine'}];
  return shipNames;
};
module.exports = gameSpecs;
