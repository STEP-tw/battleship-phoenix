let utils={};
utils.changeIndex = function (randomIndex) {
  return 1 - randomIndex;
};

utils.generateTurn = (random)=> {
  let turns = [0,1];
  let randomIndex = Math.round(random);
  return [turns[randomIndex],turns[utils.changeIndex(randomIndex)]];
};

module.exports = utils;
