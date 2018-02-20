const Player = require('./player');

class Game {
  constructor() {
    this._status = "waiting";
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
  getPlayer(id){
    return this._players[id];
  }
  hasTwoPlayers(){
    return this._playerCount>=2;
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
  updateStatus(status){
    this._status = status;
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
}
module.exports = Game;
