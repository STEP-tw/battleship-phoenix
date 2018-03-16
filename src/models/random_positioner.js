const gameSpecs = require('../utils/gameSpecifications.js');
const Validator = require('./validator.js');
const lib = require('../utils/validator_lib.js');
const randomIntBetween = lib.randomIntBetween;

class RandomPositioner{
  constructor(lowerLimit,upperLimit,fleet){
    this.lowerLimit = lowerLimit;
    this.upperLimit = upperLimit;
    this.validDirs = gameSpecs.getDirections();
    this.fleet = fleet || gameSpecs.getShipNames();
  }

  randomHeadPosition(min,max,rand){
    min = min || this.lowerLimit;
    max = max || this.upperLimit;
    return [randomIntBetween(min,max,rand),
      randomIntBetween(min,max,rand)];
  }

  randomDirection(random){
    let noOfDirs = this.validDirs.length;
    let randomIndex = randomIntBetween(0,noOfDirs,random);
    return this.validDirs[randomIndex];
  }

  randomFleetPosition(min,max,rand){
    this.fleet.forEach((ship)=>{
      ship.direction = this.randomDirection(rand);
      ship.initialPos = this.randomHeadPosition(min,max,rand);
    });
    return this.fleet;
  }

  genValidRandomFleet(min,max,rand){
    let validator = new Validator(this.lowerLimit,this.upperLimit);
    let fleet = this.randomFleetPosition(min,max,rand);
    if(validator.isValidPosition(fleet)) {
      return fleet;
    }
    return this.genValidRandomFleet(min,max,rand);
  }
}

module.exports = RandomPositioner;
