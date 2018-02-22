const Player = require('./player');

class Game {
  constructor() {
    this._status = false;
    this._players = [];
    this._playerCount = 0;
    this._currentPlayerIndex = 1;
  }
  addPlayer(name, id) {
    let player = new Player(id, name);
    this._players.push(player);
  }
  assignFleet(playerId, fleet) {
    let player = this.getPlayer(playerId);
    player.addFleet(fleet);
  }
  getFleet(playerId) {
    let player = this.getPlayer(playerId);
    return player.getFleet();
  }
  getPlayer(playerId) {
    let player = this._players.find((player) => {
      return player._id == playerId;
    });
    return player;
  }
  get players() {
    return this._players;
  }
  hasTwoPlayers() {
    return this._players.length == 2;
  }
  arePlayersReady() {
    return this._players.every(function(player) {
      return player.isReady();
    });
  }
  changePlayerStatus(playerId) {
    let player = this.getPlayer(playerId);
    return player.changeStatus();
  }
  updateStatus() {
    this._status = !this._status;
  }
  get status() {
    return this._status;
  }
  getOpponentPlayerId(currentPlayerID) {
    return this._players.find(function(player) {
      return currentPlayerID != player._id;
    })._id;
  }
  checkOpponentIsHit(currentPlayerID, position) {
    let opponentPlayerId = this.getOpponentPlayerId(currentPlayerID);
    let opponentFleet = this.getFleet(opponentPlayerId);
    return opponentFleet.isAnyShipHit(position);
  }
}
module.exports = Game;
