const Game = require('../models/game');
const Player = require('../models/player');
const createGame = function(req,res,next) {
  if (req.app.game) {
    next();
    return;
  }
  req.app.game = new Game();
  req.app.game.addPlayer();
  res.cookie('player','1');
  res.redirect('/createGame.html');
};

const addPlayerTwo = function(req,res){
  req.app.game.addPlayer();
  res.cookie('player','2');
  res.redirect('/');
};

const hasOpponentJoined = function(req,res) {
  res.send(`${req.app.game.hasTwoPlayers()}`);
};

exports.createGame = [createGame,addPlayerTwo];
exports.hasOpponentJoined = hasOpponentJoined;
