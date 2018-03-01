const utils = require('../utils/utils.js');
const hostOrJoin = function(req,res){
  let game = utils.getGame(req);
  let gameStatus = {areTwoPlayers: game && game.status};
  res.json(gameStatus);
};

exports.hostOrJoin = hostOrJoin;
