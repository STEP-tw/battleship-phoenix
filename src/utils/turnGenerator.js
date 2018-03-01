const changeIndex = function (randomIndex) {
  return 1 - randomIndex;
};

const generateTurn = (random)=> {
  let turns = [0,1];
  let randomIndex = Math.round(random);
  return [turns[randomIndex],turns[changeIndex(randomIndex)]];
};

exports.generateTurn = generateTurn;
exports.changeIndex = changeIndex;
