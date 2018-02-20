class Ship {
  constructor(direction,size,initialPos) {
    this.direction = direction;
    this.size = size;
    this.initialPos = initialPos;
    this.posOfDamage = [];
  }
}

module.exports = Ship;
