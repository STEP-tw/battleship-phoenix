const Player = require('./player');
const utils = require('../utils/utils.js');

class Game {
  constructor() {
    this._started = false;
    this._players={};
    this.currentPlayerIndex = undefined;
  }
  get playerCount(){
    return Object.keys(this._players).length;
  }
  addPlayer(name){
    let id = this.playerCount + 1;
    this._players[id]=new Player(id,name);
  }
  assignFleet(playerId,fleet){
    let player = this.getPlayer(playerId);
    player.addFleet(fleet);
  }
  getFleet(playerId){
    let player = this.getPlayer(playerId);
    return player.getFleet();
  }
  getPlayer(playerId){
    return this._players[playerId];
  }
  get players(){
    return this._players;
  }
  hasTwoPlayers(){
    return this.playerCount === 2;
  }
  arePlayersReady(){
    let players = Object.values(this._players);
    return players.every(function(player) {
      return player.isReady();
    });
  }
  changePlayerStatus(playerId){
    let player = this._players[playerId];
    return player.changeStatus();
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
  getOpponentPlayerId(currentPlayerID){
    let playerIds = Object.keys(this._players);
    let currentPlayerIndex = playerIds.findIndex(function(playerId) {
      return playerId == currentPlayerID;
    });
    if (currentPlayerIndex == 1) {
      return playerIds[0];
    }
    return playerIds[1];
  }
  checkOpponentIsHit(currentPlayerID,position){
    let opponentPlayerId = this.getOpponentPlayerId(currentPlayerID);
    let opponent = this._players[opponentPlayerId];
    return opponent.isHit(position);
  }
}
module.exports = Game;
