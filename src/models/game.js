const Player = require('./player');

class Game {
  constructor() {
    this._players={};
    this._playerCount=0;
  }
  addPlayer(){
    let id = ++this._playerCount;
    let player=new Player(id);
    this._players[id]=player;
  }
  get players(){
    return this._players;
  }
}
module.exports = Game;
