class Player {
  constructor(id) {
    this._id=id;
  }

  getPlayerId(){
    return this._id;
  }
}

module.exports=Player;
