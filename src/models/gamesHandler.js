const Game = require('./game.js');

function fetchGame(games,gameId) {
  return games[gameId];
}

function removeGame(games,game) {
  let gameId = game.id;
  delete games[gameId];
}
class GamesHandler {
  constructor(hostedGames,runningGames,completedGames,cancelledGames) {
    this._hostedGames = hostedGames || {};
    this._runningGames = runningGames || {};
    this._completedGames = completedGames || {};
    this._cancelledGames = cancelledGames || {};
  }

  addGame(game){
    this._hostedGames[game.id] = game;
    return this._hostedGames;
  }

  fetchHostedGame(gameId){
    return fetchGame(this._hostedGames,gameId);
  }

  fetchRunningGame(gameId){
    return fetchGame(this._runningGames,gameId);
  }

  fetchCompletedGame(gameId){
    return fetchGame(this._completedGames,gameId);
  }

  fetchCancelledGame(gameId){
    return fetchGame(this._cancelledGames,gameId);
  }

  startGame(game){
    removeGame(this._hostedGames,game);
    this._runningGames[game.id] = game;
  }

  endGame(game){
    removeGame(this._runningGames,game);
    this._completedGames[game.id] = game;
  }

  cancelGame(game){
    removeGame(this._hostedGames,game);
    this._cancelledGames[game.id] = game;
  }

  get hostedGamesDetails(){
    let hostedGameIds = Object.keys(this._hostedGames);
    let hostedGames = this._hostedGames;
    return hostedGameIds.map(function (gameId) {
      let game = hostedGames[gameId];
      return {gameId: game.id, hostName: game.hostName};
    });
  }
}

module.exports = GamesHandler;
