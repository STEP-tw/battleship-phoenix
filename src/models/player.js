class Player {
  constructor(id) {
    this._id=id;
    this._name = `player${id}`;
  }
  get playerId(){
    return this._id;
  }
  get playerName(){
    return this._name;
  }
}

module.exports=Player;
