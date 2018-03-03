const Game = require('./game.js');

function fetchGame(games,gameId) {
  return games.find(function (game) {
    return game.id == gameId;
  });
}

function removeGame(games,game) {
  let gameIndex = games.indexOf(game);
  let removedGame = games.splice(gameIndex,1);
  return removedGame;
}
class GamesHandler {
  constructor(hostedGames,runningGames,completedGames,cancelledGames) {
    this._hostedGames = hostedGames || [];
    this._runningGames = runningGames || [];
    this._completedGames = completedGames || [];
    this._cancelledGames = cancelledGames || [];
  }

  addGame(game){
    this._hostedGames.push(game);
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
    return this._runningGames.push(game);
  }

  endGame(game){
    removeGame(this._runningGames,game);
    return this._completedGames.push(game);
  }

  cancelGame(game){
    removeGame(this._hostedGames,game);
    return this._cancelledGames.push(game);
  }

  get hostedGamesDetails(){
    return this._hostedGames.map(function (game) {
      return {gameId: game.id, hostName: game.hostName};
    });
  }
}

module.exports = GamesHandler;
