const prefix = '../models/';
const Game = require(`${prefix}game.js`);
const Fleet = require(`${prefix}fleet.js`);
const Validator = require(`${prefix}validator.js`);
const gameSpecs = require('./gameSpecifications.js');
let utils={};

utils.setGameStatus = function (game) {
  return {
    status: game
  };
};

utils.setGameCookies = function (res,gameId,sessionId) {
  res.cookie('gameId',gameId);
  res.cookie('player', sessionId);
};

utils.getGameId = function (req) {
  return req.body.gameId || req.cookies.gameId;
};

utils.getFiredPosition = function (req) {
  return req.body.firedPosition;
};

utils.getGamesHandler = function (req) {
  return req.app.gamesHandler;
};

utils.getHostedGame = function (req) {
  let gameId = utils.getGameId(req);
  return utils.getGamesHandler(req).fetchHostedGame(gameId);
};

utils.getHostedGamesDetails = function (req) {
  let gamesHandler = utils.getGamesHandler(req);
  return gamesHandler.hostedGamesDetails;
};

utils.getRunningGame = function (req) {
  let gameId = utils.getGameId(req);
  return utils.getGamesHandler(req).fetchRunningGame(gameId);
};

utils.getPlayerId = function (req) {
  return req.cookies.player;
};

utils.getUsername = function (req) {
  return req.body.username;
};

utils.getAuthorizedUrls = function () {
  return ["/game.html", "/areplayersready", "/hasopponentwon", "/start-game"
    , "/updatefiredshot","/cancel-game","/positionsystem"
    ,"/gamestatus","/hasopponentjoined"];
};

utils.isItPrivilegedData = function (url) {
  url=url.toLowerCase();
  return utils.getAuthorizedUrls().includes(url);
};

utils.isUserTresspassing=function (req) {
  let game = utils.getRunningGame(req) || utils.getHostedGame(req);
  if(!game) {
    return utils.isItPrivilegedData(req.url);
  }
};

utils.getFleetDetails = function (req) {
  return req.body.fleetDetails;
};

utils.getFleet = function (req) {
  let fleet = new Fleet();
  let shipsHeadPositions = utils.getFleetDetails(req);
  shipsHeadPositions.forEach((ship)=>fleet.addShip(ship));
  return fleet;
};

utils.getCurrentPlayerIndex = function (game) {
  return game.turn >= 0 ? game.turn : game.assignTurn();
};

utils.addGame = function (req,game) {
  utils.getGamesHandler(req).addGame(game);
};

utils.startGame = function (req,game) {
  utils.getGamesHandler(req).startGame(game);
};

utils.cancelGame = function (req) {
  let game = utils.getHostedGame(req);
  utils.getGamesHandler(req).cancelGame(game);
};

utils.endGame = function (req, game) {
  utils.getGamesHandler(req).endGame(game);
};

utils.newSessionId = function (req) {
  return req.app.generateSessionId();
};

utils.isClassicGame = function(req){
  let isClassic = JSON.parse(req.cookies.isClassicGame || true);
  return isClassic;
};

utils.createGame = function (req) {
  let sessionId = utils.newSessionId(req);
  let isClassic = utils.isClassicGame(req);
  let game = new Game(sessionId,isClassic);
  return game;
};

utils.addPlayerDetails = function (req,res,game) {
  let name = utils.getUsername(req);
  let sessionId = utils.newSessionId(req);
  game.addPlayer(name,sessionId);
  utils.setGameCookies(res,game.id,sessionId);
  return game;
};

utils.arePlayersReady = function (game) {
  return game && game.arePlayersReady();
};

utils.handleEndgame = function (req,game,defeatStatus) {
  return defeatStatus ? utils.endGame(req, game) : false;
};

module.exports = utils;
