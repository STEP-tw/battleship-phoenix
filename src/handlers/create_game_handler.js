const Game = require('../models/game');
const Player = require('../models/player');

const hostGame = function(req,res){
  req.app.game = new Game();
  req.app.game.addPlayer();
  res.cookie('player','1');
  res.redirect('/createGame.html');
};

const isGameReadyToStart = function(game){
  return game.status == "ready to start";
};

const createGame = function(req,res,next) {
  if (req.app.game) {
    if(isGameReadyToStart(req.app.game)){
      res.send("Game has enough players, you can't join");
      return;
    }
    next();
    return;
  }
  hostGame(req,res);
};

const addSecondPlayer = function(req,res){
  req.app.game.addPlayer();
  res.cookie('player','2');
  res.redirect('/');
};

const hasOpponentJoined = function(req,res) {
  let text = `${req.app.game && req.app.game.hasTwoPlayers()}`;
  res.send(text);
};

exports.createGame = [createGame,addSecondPlayer];
exports.hasOpponentJoined = hasOpponentJoined;
