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
  isAlreadyHit(pos){
    return this.posOfDamage.some(function(damagePos) {
      return damagePos[0] == pos[0] && damagePos[1] == pos[1];
    });
  }
  updateDamage(pos){
    if (!this.isAlreadyHit(pos)) {
      this.posOfDamage.push(pos);
    }
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
