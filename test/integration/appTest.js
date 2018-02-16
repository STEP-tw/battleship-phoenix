const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const app = require('../../app.js');
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
  describe('GET /',() => {
    it('responds with page contents', function (done) {
      request(app)
        .get('/')
        .expect(200)
        .end(done);
    });
  });
  describe('GET /index.html', () => {
    it('should serve the game page', (done) => {
      request(app)
        .get('/index.html')
        .expect(/Battleship/)
        .end(done);
    });
  });
  describe('GET /createGame.html', function () {
    before(()=>{
      app.game = undefined;
    });
    it('serves the opponent arrival status', function (done) {
      request(app)
        .get('/createGame.html')
        .expect(200)
        .expect(/Welcome/)
        .end(done);
    });
  });
  describe('GET /hasOpponentJoined', function () {
    before(()=>{
      app.game = new Game();
      app.game.addPlayer(1);
    });
    it('responds false if opponent is not present', function (done) {
      request(app)
        .get('/hasOpponentJoined')
        .expect(200)
        .expect(/false/)
        .end(done);
    });
    after(()=>{
      app.game = undefined;
    });
  });

  describe('GET /hasOpponentJoined', function () {
    before(()=>{
      app.game = new Game();
      app.game.addPlayer();
      app.game.addPlayer();
    });
    it('responds true if opponent is present', function (done) {
      request(app)
        .get('/hasOpponentJoined')
        .expect(200)
        .expect(/true/)
        .end(done);
    });
    after(()=>{
      app.game=undefined;
    });
  });

  describe('GET /start-game', () => {
    before(()=>{
      app.game=new Game();
      app.game.addPlayer();
      app.game.addPlayer();
    });
    it('should start the game with two players', (done) => {
      request(app)
        .get('/start-game')
        .expect(200)
        .expect(/Game started/)
        .end(done);
    });
    after(()=>{
      app.game=undefined;
    });
  });

  describe('GET /start-game', () => {
    it('should respond that game and players are needed', (done) => {
      request(app)
        .get('/start-game')
        .expect(200)
        .expect(/Need Game and players/)
        .end(done);
    });
    after(()=>{
      app.game=undefined;
    });
  });

  describe('GET /start-game', () => {
    before(()=>{
      app.game=new Game();
      app.game.addPlayer();
    });
    it(`should respond that game and players are
        needed for one player`, (done) => {
      request(app)
        .get('/start-game')
        .expect(200)
        .expect(/Need Game and players/)
        .end(done);
    });
    after(()=>{
      app.game=undefined;
    });
  });
});
