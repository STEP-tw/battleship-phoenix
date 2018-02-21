const getCoordinates = require('./position_system.js');

class Ship {
  constructor(direction,length,initialPos) {
    this.direction = direction;
    this.length = length;
    this.initialPos = initialPos;
    this.posOfDamage = [];
  }
  getShipCoords(){
    return getCoordinates(this.direction,this.initialPos,this.length);
  }
  isHit(position){
    let shipCoords = this.getShipCoords();
    return shipCoords.some(function(coord) {
      return coord[0] == position[0] && coord[1] == position[1];
    });
  }
}

module.exports = Ship;
