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
  get players(){
    return this._players;
  }
  hasTwoPlayers(){
    return this._playerCount>=2;
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
}
module.exports = Game;
