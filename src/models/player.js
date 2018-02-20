class Player {
  constructor(id,name) {
    this._id=id;
    this._name = name;
  }
  get playerId(){
    return this._id;
  }
  get playerName(){
    return this._name;
  }
}

module.exports=Player;
