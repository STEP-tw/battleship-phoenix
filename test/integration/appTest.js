const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const Mockfs = require('../testHelper/mockfs');
const app = require('../../app.js');
app.fs = new Mockfs();
app.fs.addFile('./public/game.html','game started');

const Game = require('../../src/models/game.js');

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
    it('responds with page contents', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .end(done);
    });
  });
  describe('GET /game.html', () => {
    it('should serve the game page', (done) => {
      request(app)
        .get('/index.html')
        .expect(/Battleship/)
        .end(done);
    });
  });
  describe('POST /login', function() {
    before(() => {
      app.game = undefined;
    });
    it('redirects to create game page', function(done) {
      request(app)
        .post('/login')
        .expect(200)
        .end(done);
    });
  });
  describe('POST /login', function() {
    before(() => {
      app.game = new Game();
      app.game.addPlayer();
      app.game.addPlayer();
    });
    it('redirects to home page', function(done) {
      request(app)
        .post('/login')
        .expect(200)
        .end(done);
    });
  });
  describe('GET /getTurn', function() {
    before(() => {
      app.game = new Game();
      app.game.addPlayer('arvind');
      app.game.addPlayer();
    });
    it("gives the current player's name", function(done) {
      request(app)
        .get('/getTurn')
        .expect("arvind")
        .end(done);
    });
  });
  describe('GET /create-game', function() {
    before(() => {
      app.game = new Game();
      app.game.addPlayer();
      app.game.addPlayer();
      app.game.updateStatus("ready to start");
    });
    it('redirects to home page', function(done) {
      request(app)
        .post('/login')
        .expect("Game has enough players, you can't join")
        .end(done);
    });
  });
  describe('GET /hasOpponentJoined', function() {
    before(() => {
      app.game = new Game();
      app.game.addPlayer();
    });
    it('responds false if opponent is not present', function(done) {
      request(app)
        .get('/hasOpponentJoined')
        .expect(200)
        .expect(/false/)
        .end(done);
    });
  });
  describe('GET /hasOpponentJoined', function() {
    before(() => {
      app.game = new Game();
      app.game.addPlayer();
      app.game.addPlayer();
    });
    it('responds true if opponent is present', function(done) {
      request(app)
        .get('/hasOpponentJoined')
        .expect(200)
        .expect(/true/)
        .end(done);
    });
  });
  describe('GET /arePlayersReady', function() {
    before(() => {
      app.game = new Game();
      app.game.addPlayer();
      app.game.addPlayer();
      app.game.changePlayerStatus(1);
      app.game.assignFleet(1,{});
      app.game.assignFleet(2,{});
      app.game.changePlayerStatus(2);
    });
    it('responds true if opponent is ready', function(done) {
      request(app)
        .get('/arePlayersReady')
        .expect(200)
        .expect(/true/)
        .end(done);
    });
  });
  describe('GET /arePlayersReady', function() {
    it('responds false if opponent is not ready', function(done) {
      app.game = new Game();
      app.game.addPlayer();
      request(app)
        .get('/arePlayersReady')
        .expect(200)
        .expect(/false/)
        .end(done);
    });
    it('responds nothing if there is no game', function(done) {
      request(app)
        .get('/arePlayersReady')
        .expect(200)
        .end(done);
    });
  });
  describe('GET /start-game', () => {
    before(() => {
      app.game = new Game();
      app.game.addPlayer();
      let playerKey = Object.keys(app.game.players);
      app.game.players[playerKey].changeStatus();
      app.game.addPlayer();
    });
    it('should start the game with two players', (done) => {
      request(app)
        .get('/start-game')
        .set('Cookie',['player=2'])
        .expect(200)
        .expect('true')
        .end(done);
    });
  });
  describe('GET /positionSystem', function() {
    it('should response with content of position_system file', function(done) {
      app.fs.addFile('./src/models/position_system.js','positionSystemContent');
      request(app)
        .get('/positionSystem')
        .expect(200)
        .expect(/positionSystemContent/)
        .end(done);
    });
  });
  describe('GET /start-game', () => {
    before(()=>{
      app.game = new Game();
      app.game.addPlayer('nitesh');
      app.game.addPlayer('nitesh');
    });
    it('should respond that game and players are needed', (done) => {
      request(app)
        .get('/start-game')
        .set('Cookie',['player=1'])
        .expect(200)
        .expect('false')
        .end(done);
    });
  });
  describe('GET /cancel-game', () => {
    before(() => {
      app.game = new Game();
      app.game.addPlayer();
    });
    it('should cancel the game', (done) => {
      request(app)
        .get('/cancel-game')
        .expect("done")
        .expect((res)=>{
          assert.equal(app.game,undefined);
        })
        .end(done);
    });
  });
  describe('GET /start-game', () => {
    before(() => {
      app.game = new Game();
      app.game.addPlayer();
    });
    it(`should respond that game and players are
        needed for one player`, (done) => {
      request(app)
        .get('/start-game')
        .set('cookie','player=1')
        .expect(200)
        .end(done);
    });
  });

  describe('POST /start-game', () => {
    before(() => {
      app.game = new Game();
      app.game.addPlayer();
    });
    it(`should store the fleet details`, (done) => {
      request(app)
        .post('/start-game')
        .set('cookie','player=1')
        .send('fleetDetails=[{"dir":"south","headPos":"og_4_5","length":3}]')
        .expect(200)
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
      app.game = new Game();
      app.game.addPlayer();
    });
    it('gives game status', function(done) {
      request(app)
        .get('/host_or_join')
        .expect(200)
        .expect({areTwoPlayers: false})
        .end(done);
    });
  });
  describe('GET /host_or_join', function() {
    before(() => {
      app.game = new Game();
      app.game.addPlayer();
      app.game.addPlayer();
    });
    it('gives game status', function(done) {
      request(app)
        .get('/host_or_join')
        .expect(200)
        .expect({areTwoPlayers: true})
        .end(done);
    });
  });
});
