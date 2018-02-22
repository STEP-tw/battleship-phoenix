const Fleet = require('../models/fleet.js');
const Game = require('../models/game');

const cancelGame = function(req, res) {
  req.app.game = undefined;
  res.end();
};

const createGame = function(req, res) {
  if (!req.app.game) {
    req.app.game = new Game();
    hostGame(req, res);
    return;
  }
  joinGame(req, res);
};

const hostGame = function(req, res) {
  let name = req.body.username;
  let sessionId = req.app.generateSessionId();
  req.app.game.addPlayer(name,sessionId);
  res.cookie('player', sessionId);
  req.app.game.updateStatus();
  res.end();
};

const joinGame = function(req, res) {
  let name = req.body.username;
  let sessionId = req.app.generateSessionId();
  req.app.game.addPlayer(name,sessionId);
  res.cookie('player', sessionId);
  res.end();
};

const hasOpponentJoined = function(req, res) {
  let gameStatus = {
    status: req.app.game && req.app.game.hasTwoPlayers()
  };
  res.send(gameStatus);
};

const loadFleet = function(req, res) {
  let game = req.app.game;
  let fleet = new Fleet();
  let shipsHeadPositions = JSON.parse(req.body.fleetDetails);
  shipsHeadPositions.forEach(function(shipInfo) {
    fleet.addShip(shipInfo);
  });
  game.assignFleet(req.cookies.player, fleet);
  game.changePlayerStatus(req.cookies.player);
  res.end();
};

const arePlayersReady = function(req, res) {
  let game = req.app.game;
  let currentPlayerIndex = game.assignTurn();
  let sessionId = req.cookies.player;
  let turnStatus = game.validateId(currentPlayerIndex,sessionId);

  let playerStatus = {
    status: game && game.arePlayersReady(),
    myTurn: turnStatus
  };
  res.send(playerStatus);
};

const isHit = function(req,res) {
  let firedPos = req.body.firedPosition;
  let currentPlayerID = req.cookies.player;

  let hitStatus =req.app.game.checkOpponentIsHit(currentPlayerID,firedPos);
  res.send({firedPos:firedPos,status:hitStatus});
};


module.exports = {
  cancelGame,
  createGame,
  arePlayersReady,
  loadFleet,
  hasOpponentJoined,
  isHit
};
