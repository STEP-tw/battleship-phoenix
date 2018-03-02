const Fleet = require('../models/fleet.js');
const Game = require('../models/game');
const utils = require('../utils/utils.js');

const handleTresspassing = function(req, res, next) {
  if (utils.isUserTresspassing(req)) {
    res.redirect('index.html');
  }else{
    next();
  }
};

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
  res.end();
};

const joinGame = function(req, res) {
  let name = utils.getUsername(req);
  let sessionId = req.app.generateSessionId();
  utils.getGame(req).addPlayer(name,sessionId);
  utils.getGame(req).changeStartedStatus();
  res.cookie('player', sessionId);
  res.end();
};

const hasOpponentJoined = function(req, res) {
  let game = utils.getGame(req);
  let gameStatus = {
    status: game && game.status
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
  let currentPlayerIndex = game.turn >= 0 ? game.turn : game.assignTurn();
  let sessionId = utils.getPlayerId(req);
  let turnStatus = game.validateId(currentPlayerIndex,sessionId);
  let playerStatus = {
    status: game && game.arePlayersReady(),
    myTurn: turnStatus
  };
  res.send(playerStatus);
};

const updateShot = function(req,res) {
  let game = utils.getGame(req);
  let currentPlayerID = utils.getPlayerId(req);
  let firedPos = req.body.firedPosition;
  if(game.isAlreadFired(currentPlayerID,firedPos)){
    res.json({alreadyFired:true});
    return;
  }
  req.app.game.changeTurn();
  let hitStatus =game.checkOpponentIsHit(currentPlayerID,firedPos);
  let victoryStatus = hasOpponentLost(req);
  let turnStatus = game.validateId(game.turn,currentPlayerID);
  req.app.game.updatePlayerShot(currentPlayerID,firedPos);
  let destroyedShipsCoords = game.getOpponentSunkShipsCoords(currentPlayerID);
  res.json({
    firedPos: firedPos,
    status: hitStatus,
    winStatus: victoryStatus,
    myTurn: turnStatus,
    destroyedShipsCoords: destroyedShipsCoords
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
  let opponentShots = game.getOpponentShots(currentPlayerID);
  if(defeatStatus){
    delete req.app.game;
  }
  res.send({
    'status': defeatStatus,
    'myTurn': turnStatus,
    'opponentShots':opponentShots,
  });
};

const getGameStatus = function(req,res){
  let game = utils.getGame(req);
  let currentPlayerID = req.cookies.player;
  let fleet = game.getFleet(currentPlayerID);
  let ships;
  let destroyedShipsCoords = [];
  if(!fleet) {
    ships = [];
  } else {
    ships = fleet.getAllShips();
    destroyedShipsCoords = game.getOpponentSunkShipsCoords(currentPlayerID);
  }
  let shots = game.getCurrentPlayerShots(currentPlayerID);
  let oppShots = game.getOpponentShots(currentPlayerID);
  let player= game.getPlayer(currentPlayerID);
  let opponent= game.getOpponentPlayer(currentPlayerID);
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
  createGame,
  arePlayersReady,
  loadFleet,
  hasOpponentJoined,
  updateShot,
  hasOpponentLost,
  hasOpponentWon,
  getGameStatus,
  playAgain,
  handleTresspassing,
  quitGame,
  hasOpponentLeft
};
