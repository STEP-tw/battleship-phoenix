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
  isSunk(){
    return this.length == this.posOfDamage.length;
  }
  updateDamage(pos){
    this.posOfDamage.push(pos);
  }
  isHit(position){
    let shipCoords = this.getShipCoords();
    let hitStatus= shipCoords.some(function(coord) {
      return coord[0] == position[0] && coord[1] == position[1];
    });
    if(hitStatus) {
      this.updateDamage(position);
    }
    return hitStatus;
  }
}

module.exports = Ship;
