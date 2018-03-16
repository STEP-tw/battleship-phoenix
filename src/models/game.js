const Player = require('./player');
const generateTurn = require('../utils/turnGenerator.js').generateTurn;

class Game {
  constructor(id,players,started,cpi) {
    this._id = id;
    this._players = players || [];
    this._started = started || false;
    this.currentPlayerIndex = cpi;
  }
  addPlayer(name, id) {
    let player = new Player(id, name);
    this._players.push(player);
  }
  assignFleet(playerId, fleet) {
    let player = this.getPlayer(playerId);
    player.addFleet(fleet);
  }
  getFleet(playerId) {
    let player = this.getPlayer(playerId);
    return player.getFleet();
  }
  getPlayer(playerId) {
    let player = this._players.find((player) => {
      return player.playerId == playerId;
    });
    return player;
  }
  get players() {
    return this._players;
  }
  get hostName() {
    return this.players[0].playerName;
  }
  arePlayersReady() {
    return this._players.every(function(player) {
      return player.isReady();
    });
  }
  changePlayerStatus(playerId) {
    let player = this.getPlayer(playerId);
    return player.changeStatus();
  }
  getOpponentPlayer(currentPlayerID) {
    return this._players.find(function(player) {
      return currentPlayerID != player.playerId;
    });
  }
  getCurrentPlayer(currentPlayerID){
    return this._players.find(function(player) {
      return currentPlayerID == player.playerId;
    });
  }
  assignTurn(random=Math.random()){
    let turn = generateTurn(random);
    this.currentPlayerIndex = turn[0];
    return this.currentPlayerIndex;
  }
  changeTurn(){
    this.currentPlayerIndex = 1 - this.currentPlayerIndex;
  }
  get turn(){
    return this.currentPlayerIndex;
  }
  checkOpponentIsHit(currentPlayerID,position){
    let opponent = this.getOpponentPlayer(currentPlayerID);
    return opponent.isHit(position);
  }
  statusAfterShotIsFired(currentPlayerID){
    let opponent = this.getOpponentPlayer(currentPlayerID);
    return opponent.hasFleetDestroyed();
  }
  statusDuringOpponentTurn(currentPlayerID){
    return this.getCurrentPlayer(currentPlayerID).hasFleetDestroyed();
  }
  updatePlayerShot(currentPlayerID,position){
    let player = this.getPlayer(currentPlayerID);
    let opponentPlayer = this.getOpponentPlayer(currentPlayerID);
    let type = opponentPlayer.isHit(position)? "hits" : "misses";
    player.updateShot(type,position);
  }
  getOpponentShots(currentPlayerID){
    let opponentPlayer = this.getOpponentPlayer(currentPlayerID);
    return opponentPlayer.shots;
  }
  validateId(playerIndex,id){
    return this._players[playerIndex].isItYourId(id);
  }
  isAlreadyFired(playerId,firedPos){
    return this.getPlayer(playerId).isAlreadyFired(firedPos);
  }
  getCurrentPlayerShots(currentPlayerID){
    return this.getPlayer(currentPlayerID).shots;
  }
  getOpponentSunkShipsCoords(currentPlayerID){
    let opponent = this.getOpponentPlayer(currentPlayerID);
    return opponent.getDestroyedShipsCoords();
  }
  removePlayer(currentPlayerID){
    this._players = this._players.filter( (player) => {
      return player.playerId != currentPlayerID;
    });
  }
  getOpponentLastShot(currentPlayerID){
    let opponent = this.getOpponentPlayer(currentPlayerID);
    return opponent.getLastShot();
  }
  updateLastShot(currentPlayerID,shot,status){
    let player = this.getPlayer(currentPlayerID);
    player.updateLastShot(shot,status);
  }
  hasOpponentLeft(currentPlayerID){
    return !this.getOpponentPlayer(currentPlayerID);
  }
  get id(){
    return this._id;
  }
  isCurrentPlayer(playerId){
    return this.validateId(this.turn,playerId);
  }
  getChangedTurnStatus(currentPlayerID){
    this.changeTurn();
    return this.validateId(this.turn,currentPlayerID);
  }
  getGameStatus(playerId){
    let ships = this.getFleet(playerId).getAllShips();
    let shots = this.getCurrentPlayerShots(playerId);
    let oppShots = this.getOpponentShots(playerId);
    let playerName= this.getPlayer(playerId).playerName;
    let opponent= this.getOpponentPlayer(playerId);
    let destroyedShipsCoords = this.getOpponentSunkShipsCoords(playerId);
    return {
      fleet:ships,
      opponentHits:oppShots.hits,
      playerShots:shots,
      opponentMisses:oppShots.misses,
      playerName:playerName,
      enemyName:opponent.playerName,
      destroyedShipsCoords: destroyedShipsCoords
    };
  }
  getStatusAfterShotIsFired(playerId,firedPos,soundStatus){
    let hitStatus =this.checkOpponentIsHit(playerId,firedPos);
    let victoryStatus = this.statusAfterShotIsFired(playerId);
    let turnStatus = this.getChangedTurnStatus(playerId);
    let destroyedShipsCoords = this.getOpponentSunkShipsCoords(playerId);
    this.updatePlayerShot(playerId,firedPos);
    this.updateLastShot(playerId,firedPos,hitStatus);
    return {
      firedPos:firedPos,
      status:hitStatus,
      winStatus:victoryStatus,
      myTurn:turnStatus,
      destroyedShipsCoords: destroyedShipsCoords,
      sound:soundStatus
    };
  }
  getStatusDuringOpponentTurn(currentPlayerID,soundStatus){
    let defeatStatus = this.statusDuringOpponentTurn(currentPlayerID);
    let turnStatus = this.validateId(this.turn,currentPlayerID);
    let opponentShots = this.getOpponentShots(currentPlayerID);
    let lastShot = this.getOpponentLastShot(currentPlayerID);
    return {
      status:defeatStatus,
      myTurn:turnStatus,
      opponentShots:opponentShots,
      lastShot:lastShot,
      sound:soundStatus
    };
  }
  getPlayerPerformance(playerId){
    let player = this.getPlayer(playerId);
    let shots = player.totalShots;
    let hits = player.totalHits;
    let accuracy = +((hits/shots)*100).toFixed(2);
    return {shots:shots,hits:hits,accuracy:accuracy};
  }
}
module.exports = Game;
