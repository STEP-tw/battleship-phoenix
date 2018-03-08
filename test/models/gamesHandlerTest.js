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
    game.addPlayer('arjun',3);
    gamesHandler.addGame(game);
  });
  describe('addGame()', function () {
    it('should add given game as hosted game', function () {
      assert.deepEqual(gamesHandler._hostedGames[1],game);
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
      gamesHandler._runningGames[game.id]=game;
      let reqGame = gamesHandler.fetchRunningGame(1);
      assert.deepEqual(reqGame,game);
    });
  });
  describe('getCompletedGame', function () {
    it('should get a game from list of completed games', function () {
      gamesHandler._completedGames[game.id]=game;
      let reqGame = gamesHandler.fetchCompletedGame(1);
      assert.deepEqual(reqGame,game);
    });
  });
  describe('getCancelledGame', function () {
    it('should get a game from list of cancelled games', function () {
      gamesHandler._cancelledGames[game.id]=game;
      let reqGame = gamesHandler.fetchCancelledGame(1);
      assert.deepEqual(reqGame,game);
    });
  });
  describe('startGame()', function () {
    it('should remove the game from hosted games', function () {
      gamesHandler.startGame({'id':1234});
      assert.notInclude(gamesHandler._hostedGames,{'id':1234});
    });
    it('should add the given game to running games', function () {
      gamesHandler.addGame({"id":463467});
      gamesHandler.startGame({"id":463467});
      assert.deepInclude(gamesHandler._runningGames,{463467:{"id":463467}});
    });
  });
  describe('endGame()', function () {
    beforeEach(function () {
      gamesHandler.startGame(game);
      gamesHandler.endGame(game);
    });
    it('should remove the game from _runningGames', function () {
      assert.notInclude(gamesHandler._runningGames,{[game.id]:game});
    });

    it('should add that game in _completedGames', function () {
      assert.deepInclude(gamesHandler._completedGames,{[game.id]:game});
    });
  });
  describe('cancelGame()', function () {
    beforeEach(function () {
      gamesHandler.startGame(game);
      gamesHandler.cancelGame(game);
    });
    it('should remove the game from _hostedGames', function () {
      assert.notInclude(gamesHandler._hostedGames,{[game.id]:game});
    });

    it('should add that game in _cancelledGames', function () {
      assert.deepInclude(gamesHandler._cancelledGames,{[game.id]:game});
    });
  });
  describe('getHostedGamesDetails', function () {
    it('should get all hosted game\'s id with playerName', function () {
      let expected = [{gameId: 1, hostName: 'arjun'}];
      let actual = gamesHandler.hostedGamesDetails;
      assert.deepEqual(expected,actual);
    });
  });
});
