const getCoordinates = require('./position_system.js');
const gameSpecs=require('../utils/gameSpecifications');

class Ship {
  constructor(direction,name,initialPos,damages) {
    this.direction = direction;
    this.length = gameSpecs.getShipLength(name);
    this.initialPos = initialPos;
    this.posOfDamage = damages || [];
    this.name=name;
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
