const utils = require('../utils/utils.js');
const isValidFleet = require('../utils/validateFleet.js').isValidFleet;

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

const getErrorIfAny = function(req){
  req.check('username','Name can not be empty').trim().isLength({min:1});
  req.check('username','Invalid username').matches("^[a-zA-Z0-9]{1,10}$");
  let error = req.validationErrors();
  return error;
};

const hostGame = function(req, res) {
  let error = getErrorIfAny(req);
  if(error){
    let errorMsg = error[0].msg;
    res.send({error: errorMsg});
    return;
  }
  let game = utils.createGame(req);
  utils.addPlayerDetails(req,res,game);
  utils.addGame(req,game);
  res.end();
};

const joinGame = function(req,res) {
  let error = getErrorIfAny(req);
  if(error){
    let errorMsg = error[0].msg;
    res.send({error: errorMsg});
    return;
  }
  let game = utils.getHostedGame(req);
  utils.addPlayerDetails(req,res,game);
  utils.startGame(req,game);
  res.end();
};

const getHostedGames = function (req,res) {
  let hostedGames = utils.getHostedGamesDetails(req);
  res.send(hostedGames);
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
  if (fleet.hasRequiredShips() && isValidFleet(fleet.getAllShips())) {
    game.assignFleet(playerId,fleet);
    game.changePlayerStatus(playerId);
    res.json({status:true});
    return;
  }
  res.json({status:false});
};

const arePlayersReady = function(req, res) {
  let game = utils.getRunningGame(req);
  let currentPlayerIndex = utils.getCurrentPlayerIndex(game);
  let opponentLeft = game.hasOpponentLeft(utils.getPlayerId(req));
  if(opponentLeft){
    res.json({hasOpponentLeft:opponentLeft});
    utils.endGame(req,game);
    return;
  }
  let playerId = utils.getPlayerId(req);
  let turnStatus = game.validateId(currentPlayerIndex,playerId);
  let playerStatus = {
    status: utils.arePlayersReady(game),
    myTurn: turnStatus,
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
  let playerId = utils.getPlayerId(req);
  let opponentLeft = game.hasOpponentLeft(playerId);
  if(opponentLeft){
    res.json({hasOpponentLeft:opponentLeft});
    utils.endGame(req,game);
    return;
  }
  if(!game.isCurrentPlayer(playerId)){
    res.json({illegalTurn:true});
    return;
  }
  let firedPos = utils.getFiredPosition(req);
  let hitStatus =game.checkOpponentIsHit(playerId,firedPos);
  let victoryStatus = utils.hasOpponentLost(req);
  let turnStatus = utils.getChangedTurnStatus(game,playerId);
  let destroyedShipsCoords = game.getOpponentSunkShipsCoords(playerId);
  let soundStatus = req.cookies.sound || true;
  game.updatePlayerShot(playerId,firedPos);
  game.updateLastShot(playerId,firedPos,hitStatus);
  let shotStatus = {
    firedPos:firedPos,
    status:hitStatus,
    winStatus:victoryStatus,
    myTurn:turnStatus,
    destroyedShipsCoords: destroyedShipsCoords,
    sound:soundStatus
  };
  res.json(shotStatus);
};

const hasOpponentWon = function(req,res){
  let game = utils.getRunningGame(req);
  let currentPlayerID = utils.getPlayerId(req);
  let opponentLeft = game.hasOpponentLeft(currentPlayerID);
  let soundStatus = req.cookies.sound || true;
  if(opponentLeft){
    res.json({hasOpponentLeft:opponentLeft});
    utils.endGame(req,game);
    return;
  }
  let defeatStatus = game.hasOpponentWon(currentPlayerID);
  let turnStatus = game.validateId(game.turn,currentPlayerID);
  let opponentShots = game.getOpponentShots(currentPlayerID);
  utils.handleEndgame(req,game,defeatStatus);
  res.json({
    status:defeatStatus,
    myTurn:turnStatus,
    opponentShots:opponentShots,
    lastShot:game.getOpponentLastShot(currentPlayerID),
    sound:soundStatus
  });
};

const getGameStatus = function(req,res){
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
  let ships = fleet.getAllShips();
  let destroyedShipsCoords = game.getOpponentSunkShipsCoords(playerId);
  res.json({
    fleet:ships,
    opponentHits:oppShots.hits,
    playerShots:shots,
    opponentMisses:oppShots.misses,
    playerName:playerName,
    enemyName:opponent.playerName,
    destroyedShipsCoords: destroyedShipsCoords
  });
};

const musicController = function(req,res){
  res.cookie('music',req.body.music);
  res.json({music:req.body.music});
};
const soundController = function(req,res){
  res.cookie('sound',req.body.sound);
  res.end();
};

const getAudioStatus = function(req,res){
  let musicStatus = req.cookies.music || true;
  let soundStatus = req.cookies.sound || true;
  res.json({
    music: musicStatus,
    sound: soundStatus
  });
};

const quitGame = function(req,res) {
  utils.getRunningGame(req).removePlayer(utils.getPlayerId(req));
  res.redirect('/');
};

const leaveGame = function(req,res){
  utils.getRunningGame(req).removePlayer(utils.getPlayerId(req));
  res.redirect('/');
};

module.exports = {
  cancelGame,
  hostGame,
  joinGame,
  getHostedGames,
  arePlayersReady,
  loadFleet,
  hasOpponentJoined,
  isAlreadyFired,
  updateShot,
  hasOpponentWon,
  getGameStatus,
  leaveGame,
  handleTresspassing,
  musicController,
  soundController,
  getAudioStatus,
  quitGame
};
