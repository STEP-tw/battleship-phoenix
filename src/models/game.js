const Player = require('./player');

class Game {
  constructor() {
    this._status = false;
    this._players={};
    this._playerCount=0;
    this._currentPlayerIndex = 1;
  }
  addPlayer(name){
    let id = ++this._playerCount;
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
    return this._playerCount ==2;
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
    this._status = !this._status;
  }
  get status(){
    return this._status;
  }
  getTurn(){
    return this._players[this._currentPlayerIndex].playerName;
  }
  arePlayersReady(){
    let playerIds = Object.keys(this._players);
    return playerIds.every((playerId)=>{
      return this._players[playerId].isReady();
    });
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
  getOpponent(currentPlayerID){
    let opponentPlayerId = this.getOpponentPlayerId(currentPlayerID);
    let opponent = this._players[opponentPlayerId];
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
    return this._players[currentPlayerID].hasFleetDestroyed();
  }
}
module.exports = Game;
