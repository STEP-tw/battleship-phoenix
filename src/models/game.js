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
    console.log('-------------',playerId);
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
  updateStatus(){
    this._started = !this._started;
  }
  get status(){
    return this._started;
  }
  assignTurn(random=Math.random()){
    let turn = utils.generateTurn(random);
    this.currentPlayerIndex = turn[0];
  }
  get turn(){
    return this.currentPlayerIndex;
  }
  checkOpponentIsHit(currentPlayerID,position){
    let opponentPlayerId = this.getOpponentPlayerId(currentPlayerID);
    let opponentFleet = this.getFleet(opponentPlayerId);
    return opponentFleet.isAnyShipHit(position);
  }
}
module.exports = Game;
