const Game = require('../models/game');
const Player = require('../models/player');

const hostGame = function(req,res){
  req.app.game = new Game();
  req.app.game.addPlayer();
  res.cookie('player','1');
  res.end();
};

const isGameReadyToStart = function(game){
  return game.status == "ready to start";
};

const createGame = function(req,res,next) {
  let game=req.app.game;
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
  req.app.game.updateStatus("ready to start");
  res.cookie('player','2');
  let content=req.app.fs.readFileSync('./public/index.html','utf8');
  content=content.replace('Place your ships','game started');
  res.send(content);
};

const hasOpponentJoined = function(req,res) {
  let text = `${req.app.game && req.app.game.hasTwoPlayers()}`;
  res.send(text);
};

const turnHandler = function(req,res){
  let playerName = req.app.game.getTurn();
  res.send(playerName);
};
exports.createGame = [createGame,addSecondPlayer];
exports.hasOpponentJoined = hasOpponentJoined;
exports.turnHandler = turnHandler;
