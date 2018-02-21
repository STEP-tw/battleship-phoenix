const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const Mockfs = require('../testHelper/mockfs');
const app = require('../../app.js');
app.fs = new Mockfs();
app.fs.addFile('./public/game.html', 'game started');


const Game = require('../../src/models/game.js');
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
    after(() => {
      app.game = undefined;
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
        .expect({
          status: true
        })
        .end(done);
    });
    after(() => {
      app.game = undefined;
    });
  });

  describe('GET /arePlayersReady', function() {
    before(() => {
      app.game = new Game();
      app.game.addPlayer();
      app.game.addPlayer();
      app.game.changePlayerStatus(1);
      app.game.assignFleet(1, {});
      app.game.assignFleet(2, {});
      app.game.changePlayerStatus(2);
    });
    it('responds true when opponent is ready', function(done) {
      request(app)
        .get('/arePlayersReady')
        .expect(200)
        .expect({
          status: true
        })
        .end(done);
    });
    after(() => {
      app.game = undefined;
    });
  });
  describe('GET /arePlayersReady', function() {
    it('responds false when opponent is not ready', function(done) {
      app.game = new Game();
      app.game.addPlayer();
      request(app)
        .get('/arePlayersReady')
        .expect(200)
        .expect({
          status: false
        })
        .end(done);
    });
    after(() => {
      app.game = undefined;
    });
    it('responds nothing if there is no game', function(done) {
      request(app)
        .get('/arePlayersReady')
        .expect(200)
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
      app.game = new Game();
      app.game.addPlayer();
    });
    it('should cancel the game', (done) => {
      request(app)
        .get('/cancel-game')
        .expect((res) => {
          assert.equal(app.game, undefined);
        })
        .end(done);
    });
    after(() => {
      app.game = undefined;
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
        .set('cookie', 'player=1')
        .send('fleetDetails=[{"dir":"south","headPos":"og_4_5","length":3}]')
        .expect(200)
        .end(done);
    });
  });
});
