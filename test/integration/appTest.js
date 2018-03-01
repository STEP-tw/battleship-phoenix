/*eslint-disable max-lines*/
const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const Mockfs = require('../testHelper/mockfs');
const app = require('../../app.js');
app.fs = new Mockfs();
app.fs.addFile('./public/game.html', 'game started');

const Game = require('../../src/models/game.js');
const Fleet = require('../../src/models/fleet.js');

let game;
describe('app', () => {
  describe('GET /bad', () => {
    it('responds with 404', (done) => {
      request(app)
        .get('/bad')
        .expect(404)
        .end(done);
    });
  });
  describe('GET /', () => {
    it('responds with index.html page content with join or host game options',
      function(done) {
        request(app)
          .get('/')
          .expect(200)
          .expect(/Ships can touch each other/)
          .end(done);
      });
  });
  describe('GET /unpermitted content', () => {
    it('should redirect to index page', function(done) {
      request(app)
        .get('/game.html')
        .expect('location', 'index.html')
        .expect(302)
        .end(done);
    });
  });
  describe('POST /', () => {
    it('should give the waiting for opponent message', (done) => {
      request(app)
        .post('/')
        .expect(404)
        .end(done);
    });
  });
  describe('POST /host', function() {
    it('just stay on the page and wait for opponent', function(done) {
      request(app)
        .post('/host')
        .send({
          username: "arvind"
        })
        .expect(200)
        .end(done);
    });
  });
  describe('POST /join', function() {
    let sessionId;
    beforeEach(() => {
      let _playerId = 0;
      let gamesHandler = app.gamesHandler;
      app.generateSessionId = function() {
        return _playerId++;
      };
      sessionId = app.generateSessionId();
      game = new Game(sessionId);
      game.addPlayer('arvind', sessionId);
      gamesHandler.addGame(game);
    });
    it('should add the details of the join player', function(done) {
      request(app)
        .post('/join')
        .set('cookie', `gameId=${sessionId}`)
        .send({
          username: "arvinds"
        })
        .expect(200)
        .end(done);
    });
  });
  describe('GET /hasOpponentJoined', function() {
    let sessionId, gamesHandler;
    before(() => {
      let _playerId = 0;
      gamesHandler = app.gamesHandler;
      app.generateSessionId = function() {
        return ++_playerId;
      };
      sessionId = app.generateSessionId();
      game = new Game(sessionId);
      game.addPlayer('arvind', sessionId);
      gamesHandler.addGame(game);
    });
    it('responds false when opponent is not present', function(done) {
      request(app)
        .get('/hasOpponentJoined')
        .set('cookie', `gameId=${sessionId}`)
        .expect(200)
        .expect({})
        .end(done);
    });
  });
  describe('GET /hasOpponentJoined', function() {
    let sessionId, gamesHandler;
    before(() => {
      gamesHandler = app.gamesHandler;
      let _playerId = 0;
      app.generateSessionId = function() {
        return ++_playerId;
      };
      sessionId = app.generateSessionId();
      game = new Game(sessionId);
      game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      gamesHandler._runningGames.push(game);
      game.addPlayer('arvind', sessionId2);
      game.changeStartedStatus();
      delete game.currentPlayerIndex;
    });
    it('responds true if opponent is present', function(done) {
      request(app)
        .get('/hasOpponentJoined')
        .set('cookie', `gameId=${sessionId}`)
        .expect(200)
        .expect({
          status: game
        })
        .end(done);
    });
  });
  describe('GET /arePlayersReady', function() {
    let sessionId, sessionId2, game;
    beforeEach(() => {
      let _playerId = 0;
      generateSessionId = function() {
        return ++_playerId;
      };
      sessionId = app.generateSessionId();
      game = new Game(sessionId);
      game.addPlayer('ishu', sessionId);
      sessionId2 = app.generateSessionId();
      game.addPlayer('arvind', sessionId2);
      game.changePlayerStatus(sessionId);
      game.assignFleet(sessionId, {});
      game.assignFleet(sessionId2, {});
      app.gamesHandler.addGame(game);
      app.gamesHandler.startGame(game);
    });

    it('responds true when opponent is ready', function(done) {
      game.changePlayerStatus(sessionId2);
      request(app)
        .get('/arePlayersReady')
        .set('cookie', `gameId=${sessionId}`)
        .expect(200)
        .expect({
          status: true,
          myTurn: false
        })
        .end(done);
    });


    it('responds false when opponent is not ready', function(done) {
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      let sessionId2 = app.generateSessionId();
      app.game.addPlayer('ishu', sessionId);
      app.game.addPlayer('geniusPeople', sessionId2);
      request(app)
        .get('/arePlayersReady')
        .set('cookie', `gameId=${sessionId}`)
        .expect(200)
        .expect({
          status: false,
          myTurn: false
        })
        .end(done);
    });
  });
  describe('GET /positionSystem', function() {
    it('should response with content of position_system file', function(done) {
      app.fs.addFile('./src/models/position_system.js',
        'positionSystemContent\n\n');
      request(app)
        .get('/positionSystem')
        .expect(200)
        .expect(/positionSystemContent/)
        .end(done);
    });
  });
  describe('GET /cancel-game', () => {
    let sessionId, gamesHandler, game;
    before(() => {
      let _playerId = 0;
      gamesHandler = app.gamesHandler;
      app.generateSessionId = function() {
        return ++_playerId;
      };
      sessionId = app.generateSessionId();
      game = new Game(sessionId);
      game.addPlayer('arvind', sessionId);
      gamesHandler.addGame(game);
    });
    it('should cancel the game', (done) => {
      request(app)
        .get('/cancel-game')
        .set('cookie', `gameId=${sessionId}`)
        .expect((res) => {
          assert.deepEqual(gamesHandler._cancelledGames[0], game);
        })
        .end(done);
    });
  });
  describe('POST /start-game', () => {
    let sessionId, gamesHandler, game;
    before(() => {
      let _playerId = 0;
      gamesHandler = app.gamesHandler;
      app.generateSessionId = function() {
        return ++_playerId;
      };
      sessionId = app.generateSessionId();
      game = new Game(sessionId);
      game.addPlayer('arvind', sessionId);
      delete game.currentPlayerIndex;
      gamesHandler.addGame(game);
    });

    it(`should store the fleet details`, (done) => {
      request(app)
        .post('/start-game')
        .set('cookie', ['player=1', `gameId=${sessionId}`])
        .send({
          fleetDetails: [{
            "dir": "south",
            "headPos": "og_4_5",
            "length": 3
          }]
        })
        .expect(200)
        .end(done);
    });
  });
  describe('POST /updateFiredShot', function() {
    let sessionId, gamesHandler, game;
    beforeEach(() => {
      gamesHandler = app.gamesHandler;
      let shipInfo = {
        dir: "south",
        length: 3,
        headPos: [1, 2]
      };
      let fleet = new Fleet();
      fleet.addShip(shipInfo);
      let _playerId = 8;
      app.generateSessionId = function() {
        return ++_playerId;
      };
      sessionId = app.generateSessionId();
      game = new Game(sessionId);
      game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      game.addPlayer('arvind', sessionId2);
      game.assignTurn(0.4);
      game.assignFleet(sessionId, fleet);
      game.assignFleet(sessionId2, fleet);
      gamesHandler.addGame(game);
      gamesHandler.startGame(game);
    });
    it('Should respond with status true if any ship is hit', function(done) {
      request(app)
        .post('/updateFiredShot')
        .set('cookie', [`player=${sessionId}`, `gameId=${sessionId}`])
        .send({
          firedPosition: [1, 2]
        })
        .expect(200)
        .expect({
          firedPos: [1, 2],
          status: true,
          winStatus: false,
          myTurn: false,
          destroyedShipsCoords: []
        })
        .end(done);
    });
  });

  describe('playAgain', function() {
    let game;
    beforeEach(function() {
      let _playerId = 0;
      game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      game.addPlayer('arvind', sessionId2);
    });
    it('should changed game to undefined and redirect to index page',
      function(done) {
        request(app)
          .get('/playAgain')
          .expect(302)
          .expect('location', '/')
          .end(done);
      });
  });
  describe('playAgain', function() {
    it('should redirect to landing page if there is no game', function(done) {
      request(app)
        .get('/playAgain')
        .expect(302)
        .expect('location', '/')
        .end(done);
    });
  });
  describe('updateShot', function() {
    let sessionId, sessionId2, gamesHandler, game;
    beforeEach(function() {
      let shipInfo = {
        dir: "south",
        length: 3,
        headPos: [1, 2]
      };
      gamesHandler = app.gamesHandler;
      let fleet = new Fleet();
      fleet.addShip(shipInfo);
      let _playerId = 9;
      app.generateSessionId = function() {
        return ++_playerId;
      };
      sessionId = app.generateSessionId();
      game = new Game(sessionId);
      game.addPlayer('ishu', sessionId);
      sessionId2 = app.generateSessionId();
      game.addPlayer('arvind', sessionId2);
      game.assignFleet(sessionId, fleet);
      game.assignFleet(sessionId2, fleet);
      game.assignTurn();
      game.updatePlayerShot(10, [1, 2]);
      gamesHandler.addGame(game);
      gamesHandler.startGame(game);
    });
    it('should return true on refire at a position again', function(done) {
      request(app)
        .post('/updateFiredShot')
        .set('cookie', [`player=${sessionId}`, `gameId=${sessionId}`])
        .send({
          firedPosition: [1, 2]
        })
        .expect({isAlreadyFired: true})
        .end(done);
    });
    it('should return response 200 for fired at a position', function(done) {
      request(app)
        .post('/updateFiredShot')
        .set('cookie', [`player=${sessionId}`, `gameId=${sessionId}`])
        .send({firedPosition: [4, 2]
        })
        .expect(200)
        .end(done);
    });
  });
  describe('hasOpponentWon', function() {
    let game,gamesHandler,sessionId;
    beforeEach(function() {
      let shipInfo = {
        dir: "south",
        length: 1,
        headPos: [3, 4]
      };
      gamesHandler = app.gamesHandler;
      let fleet = new Fleet();
      fleet.addShip(shipInfo);
      let _playerId =30;
      app.generateSessionId = function() {
        return ++_playerId;
      };
      sessionId = app.generateSessionId();
      game = new Game(sessionId);
      game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      game.addPlayer('arvind', sessionId2);
      game.assignFleet(sessionId, fleet);
      game.assignFleet(sessionId2, fleet);
      game.assignTurn();
      gamesHandler.addGame(game);
      gamesHandler.startGame(game);
    });


    it('should return true if my all ships has sank', function(done) {
      game.updatePlayerShot(31, [3,4]);
      request(app)
        .get('/hasOpponentWon')
        .set('cookie', [`player=${sessionId}`, `gameId=${sessionId}`])
        .expect(200)
        .expect(/"status":true/)
        .end(done);
    });

    it('should return false if my all ship has not sank', function(done) {
      request(app)
        .get('/hasOpponentWon')
        .set('cookie', [`player=${sessionId}`, `gameId=${sessionId}`])
        .expect(200)
        .expect(/"status":false/)
        .end(done);
    });
  });
  describe('getGameStatus', function() {
    let gamesHandler, game;
    before(function() {
      let shipInfo = {
        dir: "south",
        length: 1,
        headPos: [1, 2]
      };
      gamesHandler = app.gamesHandler;
      fleet = new Fleet();
      fleet.addShip(shipInfo);
      let _playerId = 100;
      app.generateSessionId = function() {
        return ++_playerId;
      };
      sessionId = app.generateSessionId();
      game = new Game(sessionId);
      game.addPlayer('ishu', sessionId);
      sessionId2 = app.generateSessionId();
      game.addPlayer('arvind', sessionId2);
      game.assignTurn();
      gamesHandler._runningGames.push(game);
    });
    it('should return empty fleet on no ships', function(done) {
      request(app)
        .get('/gameStatus')
        .set('cookie', [`player=${sessionId}`,`gameId=${sessionId}`])
        .expect(200)
        .expect(/"fleet":\[]/)
        .end(done);
    });
    it('should return player\'s hit and miss details', function(done) {
      game.assignFleet(sessionId, fleet);
      game.assignFleet(sessionId2, fleet);
      request(app)
        .get('/gameStatus')
        .set('cookie', [`player=${sessionId2}`, `gameId=${sessionId}`])
        .expect(200)
        .expect({
          "fleet": [{
            "direction": "south",
            "length": 1,
            "initialPos": [1, 2],
            "posOfDamage": []
          }],
          "playerShots": {
            "hits": [],
            "misses": []
          },
          "opponentMisses": [],
          "opponentHits": [],
          playerName: 'arvind',
          enemyName: 'ishu',
          destroyedShips: 0
        })
        .end(done);
    });

    it('should return empty fleet when player did not place his ships'
      , function(done) {
        request(app)
          .get('/gameStatus')
          .set('cookie', 'player=2')
          .expect(200)
          .expect(/"fleet":\[]/)
          .end(done);
      });
    it('should return player details fleet hit and miss shot of players'
      , function(done) {
        app.game.assignFleet(sessionId, fleet);
        app.game.assignFleet(sessionId2, fleet);
        request(app)
          .get('/gameStatus')
          .set('cookie', 'player=2')
          .expect(200)
          .expect({
            "fleet": [{
              "direction": "south",
              "length": 1,
              "initialPos": [1, 2],
              "posOfDamage": []
            }],
            "playerShots": {
              "hits": [],
              "misses": []
            },
            "opponentMisses": [],
            "opponentHits": [],
            playerName: 'arvind',
            enemyName: 'ishu',
            destroyedShipsCoords: []
          })
          .end(done);
      });
    it('should return player details fleet hit and miss shot of players'
      , function(done) {
        app.game.assignFleet(sessionId, fleet);
        app.game.assignFleet(sessionId2, fleet);
        app.game.updatePlayerShot(1,[1, 2]);
        request(app)
          .get('/gameStatus')
          .set('cookie', 'player=2')
          .expect(200)
          .expect({
            "fleet": [{
              "direction": "south",
              "length": 1,
              "initialPos": [1, 2],
              "posOfDamage": [[1,2]]
            }],
            "playerShots": {
              "hits": [],
              "misses": []
            },
            "opponentMisses": [],
            "opponentHits": [[1,2]],
            playerName: 'arvind',
            enemyName: 'ishu',
            destroyedShipsCoords: [[[1,2]]]
          })
          .end(done);
      });
  });
  describe('GET /quit', function() {
    before(() => {
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('manindra', sessionId);
      app.game.addPlayer('ishu', sessionId);
    });
    it('should add the details of the join player', function(done) {
      request(app)
        .get('/quit')
        .set('cookie','player=1')
        .expect(302)
        .expect('Location','/')
        .end(done);
    });
  });
  describe('GET /hasOpponentLeft', function() {
    before(() => {
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('manindra', sessionId);
    });
    it('should return true if player count is 1', function(done) {
      request(app)
        .get('/hasOpponentLeft')
        .set('cookie','player=1')
        .expect(200)
        .expect('{"hasOpponentLeft":true}')
        .end(done);
    });
  });
  describe('GET /hasOpponentLeft', function() {
    before(() => {
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('manindra', sessionId);
      app.game.addPlayer('ishu', sessionId);
    });
    it('should return false if player count is 2', function(done) {
      request(app)
        .get('/hasOpponentLeft')
        .set('cookie','player=1')
        .expect(200)
        .expect('{"hasOpponentLeft":false}')
        .end(done);
    });
  });
  describe('GET /hasOpponentLeft', function() {
    it('should return empty object if there is no game', function(done) {
      request(app)
        .get('/hasOpponentLeft')
        .expect(200)
        .expect('{}')
        .end(done);
    });
  });
});
