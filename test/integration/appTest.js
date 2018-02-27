const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const Mockfs = require('../testHelper/mockfs');
const app = require('../../app.js');
app.fs = new Mockfs();
app.fs.addFile('./public/game.html', 'game started');

const Game = require('../../src/models/game.js');
const Fleet = require('../../src/models/fleet.js');

describe('app', () => {
  afterEach(() => {
    app.game = undefined;
  });
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
  describe('POST /', () => {
    it('should give the waiting for opponent message', (done) => {
      request(app)
        .post('/')
        .expect(404)
        .end(done);
    });
  });
  describe('POST /login', function() {
    it('just stay on the page and wait for opponent', function(done) {
      request(app)
        .post('/login')
        .send({
          username: "arvind"
        })
        .expect(200)
        .end(done);
    });
  });
  describe('POST /login', function() {
    before(() => {
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('arvind', sessionId);
    });
    it('should add the details of the join player', function(done) {
      request(app)
        .post('/login')
        .send({
          username: "arvinds"
        })
        .expect(200)
        .end(done);
    });
  });
  describe('GET /hasOpponentJoined', function() {
    before(() => {
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('arvind', sessionId);
    });
    it('responds false when opponent is not present', function(done) {
      request(app)
        .get('/hasOpponentJoined')
        .expect(200)
        .expect({
          status: false
        })
        .end(done);
    });
  });
  describe('GET /hasOpponentJoined', function() {
    before(() => {
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      app.game.addPlayer('arvind', sessionId2);
    });
    it('responds true if opponent is present', function(done) {
      request(app)
        .get('/hasOpponentJoined')
        .expect(200)
        .expect({
          status: true
        })
        .end(done);
    });
  });
  describe('GET /arePlayersReady', function() {
    before(() => {
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      app.game.addPlayer('arvind', sessionId2);
      app.game.changePlayerStatus(sessionId);
      app.game.assignFleet(sessionId, {});
      app.game.assignFleet(sessionId2, {});
      app.game.changePlayerStatus(sessionId2);
    });
    it('responds true when opponent is ready', function(done) {
      request(app)
        .get('/arePlayersReady')
        .expect(200)
        .expect({
          status: true,
          myTurn: false
        })
        .end(done);
    });
  });
  describe('GET /arePlayersReady', function() {
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
    before(() => {
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('ishu', sessionId);
    });
    it('should cancel the game', (done) => {
      request(app)
        .get('/cancel-game')
        .expect((res) => {
          assert.equal(app.game, undefined);
        })
        .end(done);
    });
  });
  describe('POST /start-game', () => {
    before(() => {
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('ishu', sessionId);
    });
    it(`should store the fleet details`, (done) => {
      request(app)
        .post('/start-game')
        .set('cookie', 'player=1')
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
    beforeEach(() => {
      let shipInfo = {
        dir: "south",
        length: 3,
        headPos: [1, 2]
      };
      let fleet = new Fleet();
      fleet.addShip(shipInfo);
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      app.game.addPlayer('arvind', sessionId2);
      app.game.assignTurn(0.4);
      app.game.assignFleet(sessionId, fleet);
      app.game.assignFleet(sessionId2, fleet);
    });
    it('Should respond with status true if any ship is hit', function(done) {
      request(app)
        .post('/updateFiredShot')
        .set('cookie', 'player=1')
        .send({
          firedPosition: [1, 2]
        })
        .expect(200)
        .expect({
          firedPos: [1, 2],
          status: true,
          winStatus: false,
          myTurn: false
        })
        .end(done);
    });
  });
  describe('GET /host_or_join', function() {
    it('gives game status', function(done) {
      request(app)
        .get('/host_or_join')
        .expect(200)
        .expect({})
        .end(done);
    });
  });
  describe('GET /host_or_join', function() {
    before(() => {
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('ishu', sessionId);
    });
    it('gives game status', function(done) {
      request(app)
        .get('/host_or_join')
        .expect(200)
        .expect({
          areTwoPlayers: false
        })
        .end(done);
    });
  });
  describe('GET /host_or_join', function() {
    before(() => {
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      app.game.addPlayer('arvind', sessionId2);
    });
    it('gives game status', function(done) {
      request(app)
        .get('/host_or_join')
        .expect(200)
        .expect({
          areTwoPlayers: true
        })
        .end(done);
    });
  });

  describe('playAgain', function() {
    beforeEach(function() {
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      app.game.addPlayer('arvind', sessionId2);
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
    beforeEach(function() {
      let shipInfo = {
        dir: "south",
        length: 3,
        headPos: [1, 2]
      };
      let fleet = new Fleet();
      fleet.addShip(shipInfo);
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      app.game.addPlayer('arvind', sessionId2);
      app.game.assignFleet(sessionId, fleet);
      app.game.assignFleet(sessionId2, fleet);
      app.game.assignTurn();
      app.game.updatePlayerShot(2, [1, 2]);
    });
    it('should return response code 406 for refire at a position again'
      , function(done) {
        request(app)
          .post('/updateFiredShot')
          .set('cookie', 'player=2')
          .send({
            firedPosition: [1, 2]
          })
          .expect(406)
          .end(done);
      });
    it('should return response 200 for fired at a position', function(done) {
      request(app)
        .post('/updateFiredShot')
        .set('cookie', 'player=2')
        .send({
          firedPosition: [4, 2]
        })
        .expect(200)
        .end(done);
    });
  });
  describe('hasOpponentWon', function() {
    beforeEach(function() {
      let shipInfo = {
        dir: "south",
        length: 1,
        headPos: [1, 2]
      };
      let fleet = new Fleet();
      fleet.addShip(shipInfo);
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      let sessionId = app.generateSessionId();
      app.game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      app.game.addPlayer('arvind', sessionId2);
      app.game.assignFleet(sessionId, fleet);
      app.game.assignFleet(sessionId2, fleet);
      app.game.assignTurn();
    });
    it('should return true if my all ship has sank', function(done) {
      app.game.updatePlayerShot(2, [1, 2]);
      request(app)
        .get('/hasOpponentWon')
        .set('cookie', 'player=2')
        .expect(200)
        .expect(/"status":true/)
        .end(done);
    });
    it('should return false if my all ship has not sank', function(done) {
      request(app)
        .get('/hasOpponentWon')
        .set('cookie', 'player=2')
        .expect(200)
        .expect(/"status":false/)
        .end(done);
    });
  });
  describe('getGameStatus', function() {
    beforeEach(function() {
      let shipInfo = {
        dir: "south",
        length: 1,
        headPos: [1, 2]
      };
      fleet = new Fleet();
      fleet.addShip(shipInfo);
      let _playerId = 0;
      app.game = new Game();
      app.generateSessionId = function() {
        return ++_playerId;
      };
      sessionId = app.generateSessionId();
      app.game.addPlayer('ishu', sessionId);
      sessionId2 = app.generateSessionId();
      app.game.addPlayer('arvind', sessionId2);
      app.game.assignTurn();
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
            destroyedShips:0
          })
          .end(done);
      });
  });
});
