class Player {
  constructor(id) {
    this._id=id;
  }
  get playerId(){
    console.log('hello');
    return this._id;
  }
}

module.exports=Player;
