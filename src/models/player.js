class Player {
  constructor(id,name) {
    this._id=id;
    this._name = name;
    this._status = "not ready";
  }
  get playerId(){
    return this._id;
  }
  get playerName(){
    return this._name;
  }
  changeStatus(){
    this._status = 'ready';
  }
  isReady(){
    return this._status == 'ready';
  }
}

module.exports=Player;
