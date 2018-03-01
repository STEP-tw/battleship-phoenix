// const Game = require('../models/game');
const utils = require('../utils/utils.js');

const handleTresspassing = function(req, res, next) {
  if (utils.isUserTresspassing(req)) {
    res.redirect('index.html');
  }else{
    next();
  }
};

const cancelGame = function(req, res) {
  utils.cancelGame(req);
  res.end();
};

const hostGame = function(req, res) {
  let game = utils.createGame(req);
  utils.addPlayerDetails(req,res,game);
  utils.addGame(req,game);
  res.end();
};

const joinGame = function(req,res) {
  let game = utils.getHostedGame(req);
  utils.addPlayerDetails(req,res,game);
  game.changeStartedStatus();
  utils.startGame(req,game);
  res.end();
};

const hasOpponentJoined = function(req, res) {
  let game = utils.getRunningGame(req);
  let gameStatus = utils.setGameStatus(game);
  res.send(gameStatus);
};

const loadFleet = function(req, res) {
  let game = utils.getRunningGame(req);
  let playerId = utils.getPlayerId(req);
  let fleet = utils.getFleet(req);
  game.assignFleet(playerId,fleet);
  game.changePlayerStatus(playerId);
  res.end();
};

const arePlayersReady = function(req, res) {
  let game = utils.getRunningGame(req);
  let currentPlayerIndex = utils.getCurrentPlayerIndex(game);
  let playerId = utils.getPlayerId(req);
  let turnStatus = game.validateId(currentPlayerIndex,playerId);
  let playerStatus = {
    status: utils.arePlayersReady(game),
    myTurn: turnStatus
  };
  res.send(playerStatus);
};

const isAlreadyFired = function (req,res,next) {
  let game = utils.getRunningGame(req);
  let currentPlayerID = utils.getPlayerId(req);
  let firedPos = utils.getFiredPosition(req);
  if(game.isAlreadyFired(currentPlayerID,firedPos)){
    res.send({isAlreadyFired: true});
  }else {
    next();
  }
};

const updateShot = function(req,res) {
  let game = utils.getRunningGame(req);
  let currentPlayerID = utils.getPlayerId(req);
  let firedPos = utils.getFiredPosition(req);
  let hitStatus =game.checkOpponentIsHit(currentPlayerID,firedPos);
  let victoryStatus = utils.hasOpponentLost(req);
  let turnStatus = utils.getChangedTurnStatus(game,currentPlayerID);
  game.updatePlayerShot(currentPlayerID,firedPos);
  let shotStatus = {
    firedPos:firedPos,
    status:hitStatus,
    winStatus:victoryStatus,
    myTurn: turnStatus
  };
  res.json(shotStatus);
};

const playAgain = function(req,res){
  res.redirect('/');
};

const hasOpponentWon = function(req,res){
  let game = utils.getRunningGame(req);
  let currentPlayerID = utils.getPlayerId(req);
  let defeatStatus = game.hasOpponentWon(currentPlayerID);
  let turnStatus = game.validateId(game.turn,currentPlayerID);
  let opponentShots = game.getOpponentShots(currentPlayerID);
  let destroyedShips = game.getSankOpponentShipsCount(currentPlayerID);
  utils.handleEndgame(req,game,defeatStatus);
  res.send({
    status:defeatStatus,
    myTurn: turnStatus,
    opponentShots:opponentShots,
    destroyedShips:destroyedShips
  });
};

const getGameStatus = function(req,res){
  let destroyedShips = [];
  let playerId = utils.getPlayerId(req);
  let game = utils.getRunningGame(req);
  let fleet = game.getFleet(playerId);
  let shots = game.getCurrentPlayerShots(playerId);
  let oppShots = game.getOpponentShots(playerId);
  let playerName= game.getPlayer(playerId).playerName;
  let opponent= game.getOpponentPlayer(playerId);
  let opponentName = opponent.playerName;
  let oppMisses = oppShots.misses;
  let hits = oppShots.hits;
  let ships;
  let destroyedShipsCoords = [];
  if(!fleet) {
    ships = [];
  } else {
    destroyedShips = game.getSankOpponentShipsCount(playerId);
    ships = fleet.getAllShips();
    destroyedShipsCoords = game.getOpponentSunkShipsCoords(currentPlayerID);
  }
  res.json({
    fleet:ships,
    opponentHits:oppShots.hits,
    playerShots:shots,
    opponentMisses:oppShots.misses,
    playerName:player.playerName,
    enemyName:opponent.playerName,
    destroyedShipsCoords: destroyedShipsCoords
  });
};

const quitGame = function(req,res) {
  utils.getGame(req).removePlayer(req.cookies.player);
  res.redirect('/');
};

const sendOpponentStatus = function(req,res) {
  let game = utils.getGame(req);
  if (game.playerCount==1) {
    res.json({hasOpponentLeft:true});
    delete req.app.game;
    return;
  }
  res.json({hasOpponentLeft:false});
};

const hasOpponentLeft = function(req,res) {
  let game = utils.getGame(req);
  if(!game){
    res.json({});
    return;
  }
  sendOpponentStatus(req,res);
};

module.exports = {
  cancelGame,
  hostGame,
  joinGame,
  arePlayersReady,
  loadFleet,
  hasOpponentJoined,
  isAlreadyFired,
  updateShot,
  hasOpponentWon,
  getGameStatus,
  playAgain,
  handleTresspassing,
  quitGame,
  hasOpponentLeft
};
