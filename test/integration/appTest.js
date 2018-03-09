/*eslint-disable max-lines*/
const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const Mockfs = require('../testHelper/mockfs');
const app = require('../../app.js');
const Game = require('../../src/models/game.js');
const Fleet = require('../../src/models/fleet.js');
const GamesHandler = require('../../src/models/gamesHandler.js');
app.fs = new Mockfs();
app.fs.addFile('./public/game.html', 'game started');


describe('app', () => {
  let gamesHandler,game,sessionId,sessionId2;
  beforeEach(function () {
    let _playerId = 0;
    if(app.gamesHandler instanceof GamesHandler){
      app.gamesHandler = new GamesHandler();
    }
    gamesHandler = app.gamesHandler;
    app.generateSessionId = function() {
      return ++_playerId;
    };
    sessionId = app.generateSessionId();
    game = new Game(sessionId);
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
          .expect(/You can place ships in your base/)
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

  describe('POST /controlMusic', function () {
    it('should respond with current music status', function (done) {
      request(app)
        .post('/controlMusic')
        .send({music:true})
        .expect(200)
        .expect({music:true})
        .expect((res)=>{
          let expected = 'music=true';
          let actual = res.header['set-cookie'][0].split(';')[0];
          assert.equal(expected,actual);
        })
        .end(done);
    });
  });

  describe('POST /controlSound', function () {
    it('should respond with current sound status', function (done) {
      request(app)
        .post('/controlSound')
        .set('cookie',`sound=true`)
        .send({sound:true})
        .expect(200)
        .expect((res)=>{
          let expected = 'sound=true';
          let actual = res.header['set-cookie'][0].split(';')[0];
          assert.equal(expected,actual);
        })
        .end(done);
    });
  });

  describe('GET /audioStatus', function () {
    it('should respond with current audio status', function (done) {
      request(app)
        .get('/audioStatus')
        .set('cookie',[`sound=false`,`music=true`])
        .expect(200)
        .expect({music:'true',sound:'false'})
        .end(done);
    });
    it('should respond with true by default', function (done) {
      request(app)
        .get('/audioStatus')
        .expect(200)
        .expect({music:true,sound:true})
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
    it('should add the details of the join player', function(done) {
      game.addPlayer('arvind', sessionId);
      gamesHandler.addGame(game);
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

  describe('/getHostedGame', function () {
    it('should get a list of hosted games', function (done) {
      game.addPlayer('arvind', sessionId);
      gamesHandler.addGame(game);
      request(app)
        .get('/getHostedGames')
        .expect(200)
        .expect([{"gameId":`${sessionId}`,"hostName":"arvind"}])
        .end(done);
    });
  });

  describe('GET /hasOpponentJoined', function() {
    it('responds false when opponent is not present', function(done) {
      game.addPlayer('arvind', sessionId);
      gamesHandler.addGame(game);
      request(app)
        .get('/hasOpponentJoined')
        .set('cookie', `gameId=${sessionId}`)
        .expect(200)
        .expect({})
        .end(done);
    });
  });

  describe('GET /hasOpponentJoined', function() {
    it('responds true if opponent is present', function(done) {
      game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      gamesHandler._runningGames[game.id]=game;
      game.addPlayer('arvind', sessionId2);
      game.assignTurn();
      delete game.currentPlayerIndex;
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
    it('responds true when opponent is ready', function(done) {
      game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      game.addPlayer('arvind', sessionId2);
      game.assignFleet(sessionId, {});
      game.changePlayerStatus(sessionId);
      game.assignFleet(sessionId2, {});
      game.changePlayerStatus(sessionId2);
      game.assignTurn(0.6);
      gamesHandler.addGame(game);
      gamesHandler.startGame(game);
      request(app)
        .get('/arePlayersReady')
        .set('cookie', [`player=${sessionId}`, `gameId=${sessionId}`])
        .expect(200)
        .expect({
          status: true,
          myTurn: false
        })
        .end(done);
    });

    describe('GET /arePlayersReady', function() {
      it('responds true when opponent is ready', function(done) {
        game.addPlayer('ishu', 1);
        gamesHandler.addGame(game);
        gamesHandler.startGame(game);
        request(app)
          .get('/arePlayersReady')
          .set('cookie', [`player=${1}`, `gameId=${sessionId}`])
          .expect(200)
          .expect({
            hasOpponentLeft:true
          })
          .end(done);
      });
    });

    it('responds false when opponent is not ready', function(done) {
      let sessionId2 = app.generateSessionId();
      game.addPlayer('ishu', sessionId2);
      gamesHandler.addGame(game);
      gamesHandler.startGame(game);
      game.addPlayer('geniusPeople', sessionId2);
      request(app)
        .get('/arePlayersReady')
        .set('cookie', [`player=${sessionId}`, `gameId=${sessionId}`])
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
      game.addPlayer('arvind', sessionId);
      gamesHandler.addGame(game);
      gamesHandler.startGame(game);
      app.fs.addFile('./src/models/position_system.js',
        'positionSystemContent\n\n');
      request(app)
        .get('/positionSystem')
        .set('cookie', [`player=${sessionId}`, `gameId=${sessionId}`])
        .expect(200)
        .expect(/positionSystemContent/)
        .end(done);
    });
  });

  describe('GET /cancel-game', () => {
    it('should cancel the game', (done) => {
      game.addPlayer('arvind', sessionId);
      gamesHandler.addGame(game);
      request(app)
        .get('/cancel-game')
        .set('cookie', [`player=${sessionId}`, `gameId=${1}`])
        .expect((res) => {
          assert.deepEqual(gamesHandler._cancelledGames[game.id], game);
        })
        .end(done);
    });
  });

  describe('POST /start-game', () => {
    it(`should send false when fleet does not have required ships`, (done) => {
      game.addPlayer('arvind', sessionId);
      delete game.currentPlayerIndex;
      gamesHandler.addGame(game);
      gamesHandler.startGame(game);
      request(app)
        .post('/start-game')
        .set('cookie', [`player=${sessionId}`, `gameId=${sessionId}`])
        .send({
          fleetDetails: [{
            "dir": "south",
            "headPos": "og_4_5",
            "length": 3
          }]
        })
        .expect(200)
        .expect({status:false})
        .end(done);
    });
    it(`should send true when fleet has required ships`, (done) => {
      game.addPlayer('arvind', sessionId);
      delete game.currentPlayerIndex;
      gamesHandler.addGame(game);
      gamesHandler.startGame(game);
      let fleetsInfo=[{
        "dir": "south",
        "headPos": [4,5],
        "name" : "cruiser"
      },{
        "dir": "south",
        "headPos": [1,8],
        "name":"destroyer"
      },{
        "dir": "south",
        "headPos": [0,0],
        "name":"carrier"
      },{
        "dir": "north",
        "headPos": [4,4],
        "name":"submarine"
      },{
        "dir": "east",
        "headPos": [1,8],
        "name":"battleship"
      }];
      request(app)
        .post('/start-game')
        .set('cookie', [`player=${sessionId}`, `gameId=${sessionId}`])
        .send({
          fleetDetails:fleetsInfo
        })
        .expect(200)
        .expect({status:true})
        .end(done);
    });
  });

  describe('POST /updateFiredShot', function() {
    it('Should respond with status true if any ship is hit', function(done) {
      let shipInfo = {
        dir: "south",
        name: "carrier",
        headPos: [1, 2]
      };
      let fleet = new Fleet();
      fleet.addShip(shipInfo);
      game.addPlayer('ishu', sessionId);
      let sessionId2 = app.generateSessionId();
      game.addPlayer('arvind', sessionId2);
      game.assignTurn(0.4);
      game.assignFleet(sessionId, fleet);
      game.assignFleet(sessionId2, fleet);
      gamesHandler.addGame(game);
      gamesHandler.startGame(game);
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
          destroyedShipsCoords: [],
          sound :true
        })
        .end(done);
    });
  });

  describe('updateShot', function() {
    beforeEach(function() {
      let shipInfo = {
        dir: "south",
        name:"carrier",
        headPos: [1, 2]
      };
      gamesHandler = app.gamesHandler;
      let fleet = new Fleet();
      fleet.addShip(shipInfo);
      game.addPlayer('ishu', sessionId);
      sessionId2 = app.generateSessionId();
      game.addPlayer('arvind', sessionId2);
      game.assignFleet(sessionId, fleet);
      game.assignFleet(sessionId2, fleet);
      game.assignTurn(0.4);
      game.updatePlayerShot(1, [1, 2]);
      gamesHandler.addGame(game);
      gamesHandler.startGame(game);
    });
    it('should return 406 for refire at a position again', function(done) {
      request(app)
        .post('/updateFiredShot')
        .set('cookie', [`player=${sessionId}`, `gameId=${sessionId}`])
        .send({
          firedPosition: [1, 2]
        })
        .expect({isAlreadyFired: true})
        .end(done);
    });
    it('should respond with an empty object for illegal turn', function (done) {
      request(app)
        .post('/updateFiredShot')
        .set('cookie', [`player=${sessionId2}`, `gameId=${sessionId}`])
        .send({firedposition:[1,2]})
        .expect({illegalTurn:true})
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
    it.skip('should give hasOpponentLeft as true if opponent leaves',(done)=>{
      game.removePlayer(sessionId2);
      request(app)
        .post('/updateFiredShot')
        .set('cookie', [`player=${sessionId}`, `gameId=${sessionId}`])
        .send({firedPosition: [4, 2]})
        .expect(200)
        .expect('{"hasOpponentLeft":true}')
        .end(done);
    });
  });

  describe('hasOpponentWon', function() {
    beforeEach(function() {
      let shipInfo = {
        dir: "south",
        name:"destroyer",
        headPos: [3, 4]
      };
      gamesHandler = app.gamesHandler;
      let fleet = new Fleet();
      fleet.addShip(shipInfo);
      game.addPlayer('ishu', sessionId);
      sessionId2 = app.generateSessionId();
      game.addPlayer('arvind', sessionId2);
      game.assignFleet(sessionId, fleet);
      game.assignFleet(sessionId2, fleet);
      game.assignTurn();
      gamesHandler.addGame(game);
      gamesHandler.startGame(game);
    });


    it('should return true if my all ships has sank', function(done) {
      game.updatePlayerShot(1,[3,4]);
      game.updatePlayerShot(1,[3,5]);
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
    it('should give hasOpponentLeft as true if opponent leaves',(done)=>{
      game.removePlayer(sessionId2);
      request(app)
        .get('/hasopponentwon')
        .set('cookie', [`player=${sessionId}`, `gameId=${sessionId}`])
        .expect(200)
        .expect('{"hasOpponentLeft":true}')
        .end(done);
    });
  });

  describe('getGameStatus', function() {
    it('should return empty fleet on no ships', function(done) {
      game.addPlayer('ishu', sessionId);
      sessionId2 = app.generateSessionId();
      game.addPlayer('arvind', sessionId2);
      game.assignTurn();
      gamesHandler._runningGames[game.id]=game;
      request(app)
        .get('/gameStatus')
        .set('cookie', [`player=${sessionId}`,`gameId=${sessionId}`])
        .expect(200)
        .expect(/"fleet":\[]/)
        .end(done);
    });
    it('should return player\'s hit and miss details', function(done) {
      let shipInfo = {
        dir: "south",
        name:"carrier",
        headPos: [1, 2]
      };
      fleet = new Fleet();
      fleet.addShip(shipInfo);
      game.addPlayer('ishu', sessionId);
      sessionId2 = app.generateSessionId();
      game.addPlayer('arvind', sessionId2);
      game.assignTurn();
      gamesHandler._runningGames[game.id]=game;
      game.assignFleet(sessionId, fleet);
      game.assignFleet(sessionId2, fleet);
      request(app)
        .get('/gameStatus')
        .set('cookie', [`player=${sessionId2}`, `gameId=${sessionId}`])
        .expect(200)
        .expect({
          "fleet": [{
            "direction": "south",
            "name":"carrier",
            "length":5,
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
  });

  describe('GET /quit', () => {
    it('should remove the player and redirect to home page', (done) => {
      game.addPlayer('arvind', sessionId);
      game.addPlayer('ishu', 2);
      gamesHandler.addGame(game);
      gamesHandler.startGame(game);
      request(app)
        .get('/quit')
        .set('cookie', [`player=${sessionId}`, `gameId=${1}`])
        .expect(302)
        .expect('Location','/')
        .end(done);
    });
  });
  describe('GET /leave', () => {
    it('should cancel the game and redirect to home page', (done) => {
      game.addPlayer('arvind', sessionId);
      game.addPlayer('ishu', 2);
      gamesHandler.addGame(game);
      gamesHandler.startGame(game);
      request(app)
        .get('/leave')
        .set('cookie', [`player=${sessionId}`, `gameId=${1}`])
        .expect(302)
        .expect('Location','/')
        .end(done);
    });
  });
});
