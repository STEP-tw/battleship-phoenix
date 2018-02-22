const Player = require('./player');

class Game {
  constructor() {
    this._players = [];
    this._started = false;
    this._playerCount = 0;
    this._currentPlayerId = 1;
  }
  addPlayer(name, id) {
    let player = new Player(id, name);
    this._players.push(player);
  }
  get playerCount(){
    return Object.keys(this._players).length;
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
      return player._id == playerId;
    });
    return player;
  }
  get players() {
    return this._players;
  }
  hasTwoPlayers() {
    return this._players.length == 2;
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
  getOpponentPlayerId(currentPlayerID) {
    return this._players.find(function(player) {
      return currentPlayerID != player._id;
    })._id;
  }
  getOpponentPlayer(currentPlayerID) {
    return this._players.find(function(player) {
      return currentPlayerID != player._id;
    });
  }
  getCurrentPlayer(currentPlayerID){
    return this._players.find(function(player) {
      return currentPlayerID == player._id;
    });
  }
  updateStatus(){
    this._started = !this._started;
  }
  get status(){
    return this._started;
  }
  getOpponent(currentPlayerID){
    let opponent = this.getOpponentPlayer(currentPlayerID);
    return opponent;
  }
  checkOpponentIsHit(currentPlayerID,position){
    let opponent = this.getOpponent(currentPlayerID);
    return opponent.isHit(position);
  }
  hasOpponentLost(currentPlayerID){
    let opponent = this.getOpponent(currentPlayerID);
    return opponent.hasFleetDestroyed();
  }
  hasOpponentWon(currentPlayerID){
    return this.getCurrentPlayer(currentPlayerID).hasFleetDestroyed();
  }
}
module.exports = Game;
