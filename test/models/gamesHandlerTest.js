const chai = require('chai');
const assert = chai.assert;
let sourcePath = '../../src/models/';
const GamesHandler = require(`${sourcePath}gamesHandler.js`);
const Game = require(`${sourcePath}game.js`);

let game;
let gamesHandler;
describe('GamesHandler', function () {
  beforeEach(function () {
    gamesHandler = new GamesHandler();
    game = new Game(1);
    gamesHandler.addGame(game);
  });
  describe('addGame()', function () {
    it('should add given game as hosted game', function () {
      assert.include(gamesHandler._hostedGames,game);
    });
  });

  describe('getHostedGame', function () {
    it('should get a game from list of hosted games', function () {
      let reqGame = gamesHandler.fetchHostedGame(1);
      assert.deepEqual(reqGame,game);
    });
  });
  describe('getRunningGame', function () {
    it('should get a game from list of running games', function () {
      gamesHandler._runningGames.push(game);
      let reqGame = gamesHandler.fetchRunningGame(1);
      assert.deepEqual(reqGame,game);
    });
  });
  describe('getCompletedGame', function () {
    it('should get a game from list of completed games', function () {
      gamesHandler._completedGames.push(game);
      let reqGame = gamesHandler.fetchCompletedGame(1);
      assert.deepEqual(reqGame,game);
    });
  });
  describe('getCancelledGame', function () {
    it('should get a game from list of cancelled games', function () {
      gamesHandler._cancelledGames.push(game);
      let reqGame = gamesHandler.fetchCancelledGame(1);
      assert.deepEqual(reqGame,game);
    });
  });
  describe('startGame()', function () {
    it('should remove the game from hosted games', function () {
      gamesHandler.startGame(1234);
      assert.notInclude(gamesHandler._hostedGames,1234);
    });
    it('should add the given game to running games', function () {
      gamesHandler.addGame(463467);
      gamesHandler.startGame(463467);
      assert.include(gamesHandler._runningGames,463467);
    });
  });
  describe('endGame()', function () {
    beforeEach(function () {
      gamesHandler.startGame(game);
      gamesHandler.endGame(game);
    });
    it('should remove the game from _runningGames', function () {
      assert.notInclude(gamesHandler._runningGames,game);
    });

    it('should add that game in _completedGames', function () {
      assert.include(gamesHandler._completedGames,game);
    });
  });
  describe('cancelGame()', function () {
    beforeEach(function () {
      gamesHandler.startGame(game);
      gamesHandler.cancelGame(game);
    });
    it('should remove the game from _hostedGames', function () {
      assert.notInclude(gamesHandler._hostedGames,game);
    });

    it('should add that game in _cancelledGames', function () {
      assert.include(gamesHandler._cancelledGames,game);
    });
  });
});
