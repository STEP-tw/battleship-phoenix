const Game = require('../models/game');
const Player = require('../models/Player');
const createGame = function(req,res,next) {
  if (!req.app.game) {
    req.app.game = new Game();
    req.app.game.addPlayer();
    next();
  }
};


const hasOpponentJoined = function(req,res) {
  res.send(`${req.app.game.hasTwoPlayers()}`);
};

exports.createGame = createGame;
exports.hasOpponentJoined = hasOpponentJoined;
