const Player = require('./player');

class Game {
  constructor() {
    this._status = "waiting";
    this._players={};
    this._playerCount=0;
  }
  addPlayer(){
    if(this.hasTwoPlayers()){
      this.updateStatus("ready to start");
    }
    let id = ++this._playerCount;
    this._players[id]=new Player(id);
  }
  get players(){
    return this._players;
  }
  hasTwoPlayers(){
    return this._playerCount==2;
  }
  updateStatus(status){
    this._status = status;
  }
  get status(){
    return this._status;
  }
}
module.exports = Game;
