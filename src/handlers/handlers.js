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
  req.app.game.addPlayer(name);
  res.cookie('player', 1);
  req.app.game.updateStatus();
  res.end();
};

const joinGame = function(req, res) {
  let name = req.body.username;
  req.app.game.addPlayer(name);
  res.cookie('player', 2);
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
  let playerStatus = {
    status: req.app.game && req.app.game.arePlayersReady()
  };
  res.send(playerStatus);
};

const isHit = function(req,res) {
  let firedPos = req.body.firedPosition;
  let currentPlayerID = req.cookies.player;
  let hitStatus =req.app.game.checkOpponentIsHit(currentPlayerID,firedPos);
  res.send({firedPos:firedPos,status:hitStatus});
};

const hasOpponentLost = function(req,res){
  let currentPlayerID = req.cookies.player;
  let victoryStatus = req.app.game.hasOpponentLost(currentPlayerID);
  res.send({status:victoryStatus});
};

const hasOpponentWon = function(req,res){
  let currentPlayerID = req.cookies.player;
  let victoryStatus = req.app.game.hasOpponentWon(currentPlayerID);
  res.send({status:victoryStatus});
};

const logRequest = function(tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), `-`,
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.cookies)
  ].join(' ');
};


module.exports = {
  cancelGame,
  createGame,
  arePlayersReady,
  loadFleet,
  hasOpponentJoined,
  logRequest,
  isHit,
  hasOpponentLost,
  hasOpponentWon
};
