class Player {
  constructor(id) {
    this._id=id;
  }
  get playerId(){
    return this._id;
  }
}

module.exports=Player;
