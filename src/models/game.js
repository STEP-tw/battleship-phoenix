const Player = require('./player');

class Game {
  constructor() {
    this._players={};
    this._count=1;
  }
  addPlayer(){
    let id=this._count;
    let player=new Player(id);
    this._players[id]=player;
    this._count++;
  }
  get players(){
    return this._players;
  }
}
module.exports = Game;
