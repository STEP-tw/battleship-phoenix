const Fleet = require('../models/fleet.js');
const Game = require('../models/game');
const utils = require('../utils/utils.js');

const cancelGame = function(req, res) {
  delete req.app.game;
  res.end();
};

const createGame = function(req, res) {
  let game = utils.getGame(req);
  if (!game) {
    req.app.game = new Game();
    hostGame(req, res);
    return;
  }
  joinGame(req, res);
};

const hostGame = function(req, res) {
  let name = utils.getUsername(req);
  let sessionId = req.app.generateSessionId();
  let game = utils.getGame(req);

  game.addPlayer(name,sessionId);
  res.cookie('player', sessionId);
  game.updateStatus();
  res.end();
};

const joinGame = function(req, res) {
  let name = utils.getUsername(req);
  let sessionId = req.app.generateSessionId();

  utils.getGame(req).addPlayer(name,sessionId);
  res.cookie('player', sessionId);
  res.end();
};

const hasOpponentJoined = function(req, res) {
  let game = utils.getGame(req);
  let gameStatus = {
    status: game && game.hasTwoPlayers()
  };
  res.send(gameStatus);
};

const loadFleet = function(req, res) {
  let game = utils.getGame(req);
  let playerId = utils.getPlayerId(req);
  let fleet = new Fleet();
  let shipsHeadPositions = req.body.fleetDetails;
  shipsHeadPositions.forEach(function(shipInfo) {
    fleet.addShip(shipInfo);
  });
  game.assignFleet(playerId,fleet);
  game.changePlayerStatus(playerId);
  res.end();
};

const arePlayersReady = function(req, res) {
  let game = utils.getGame(req);
  let currentPlayerIndex = game.turn || game.assignTurn();
  let sessionId = utils.getPlayerId(req);
  let turnStatus = game.validateId(currentPlayerIndex,sessionId);

  let playerStatus = {
    status: game && game.arePlayersReady(),
    myTurn: turnStatus
  };
  res.send(playerStatus);
};

const updateShot = function(req,res) {
  req.app.game.changeTurn();
  let game = utils.getGame(req);
  let firedPos = req.body.firedPosition;
  let currentPlayerID = utils.getPlayerId(req);
  let hitStatus =game.checkOpponentIsHit(currentPlayerID,firedPos);
  let victoryStatus = hasOpponentLost(req);
  let turnStatus = game.validateId(game.turn,currentPlayerID);
  req.app.game.updatePlayerShot(currentPlayerID,firedPos);
  res.send({
    firedPos:firedPos,
    status:hitStatus,
    winStatus:victoryStatus,
    myTurn: turnStatus
  });
};

const playAgain = function(req,res){
  let game = utils.getGame(req);
  if(game && game.playerCount!=1){
    delete req.app.game;
  }
  res.redirect('/');
};

const hasOpponentLost = function(req,res){
  let currentPlayerID = utils.getPlayerId(req);
  let victoryStatus = utils.getGame(req).hasOpponentLost(currentPlayerID);
  return victoryStatus;
};

const hasOpponentWon = function(req,res){
  let game = utils.getGame(req);
  let currentPlayerID = utils.getPlayerId(req);
  let defeatStatus = game.hasOpponentWon(currentPlayerID);
  let turnStatus = game.validateId(game.turn,currentPlayerID);
  res.send({status:defeatStatus,myTurn: turnStatus});
};

const getGameStatus = function(req,res){
  let fleet = req.app.game.getFleet(req.cookies.player);
  res.json({fleet:fleet.ships});
};

module.exports = {
  cancelGame,
  createGame,
  arePlayersReady,
  loadFleet,
  hasOpponentJoined,
  updateShot,
  hasOpponentLost,
  hasOpponentWon,
  getGameStatus,
  playAgain
};
