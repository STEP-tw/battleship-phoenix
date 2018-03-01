const Player = require('./player');
const utils = require('../utils/utils.js');

class Game {
  constructor() {
    this._players = [];
    this._started = false;
    this.currentPlayerIndex = undefined;
  }
  addPlayer(name, id) {
    let player = new Player(id, name);
    this._players.push(player);
  }
  get playerCount(){
    return this._players.length;
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
  changeStartedStatus(){
    this._started = !this._started;
  }
  get status(){
    return this._started;
  }
  assignTurn(random=Math.random()){
    let turn = utils.generateTurn(random);
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
  hasOpponentLost(currentPlayerID){
    let opponent = this.getOpponentPlayer(currentPlayerID);
    return opponent.hasFleetDestroyed();
  }
  hasOpponentWon(currentPlayerID){
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
  isAlreadFired(playerId,firedPos){
    return this.getPlayer(playerId).isAlreadFired(firedPos);
  }
  getCurrentPlayerShots(currentPlayerID){
    return this.getPlayer(currentPlayerID).shots;
  }
  getSankOpponentShipsCount(currentPlayerID){
    let opponent = this.getOpponentPlayer(currentPlayerID);
    return opponent.getDestroyedShipsCount();
  }
  getOpponentSunkShipsCoords(currentPlayerID){
    let opponent = this.getOpponentPlayer(currentPlayerID);
    return opponent.getDestroyedShipsCoords();
  }
}
module.exports = Game;
