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
  describe('GET /createGame', function () {
    before(()=>{
      app.game = new Game();
      app.game.addPlayer();
    });
    it('redirects to home page on opponents arrival', function (done) {
      request(app)
        .get('/createGame')
        .expect(302)
        .expect("Location","/")
        .end(done);
    });
  });
  describe('GET /createGame', function () {
    before(()=>{
      app.game = undefined;
    });
    it('redirects to create game page', function (done) {
      request(app)
        .get('/createGame')
        .expect(302)
        .expect("Location","/createGame.html")
        .end(done);
    });
  });
  describe('GET /hasOpponentJoined', function () {
    before(()=>{
      app.game = new Game();
      app.game.addPlayer();
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
      app.game = undefined;
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
        .expect(302)
        .expect('location','/index.html')
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
        .end(done);
    });
    after(()=>{
      app.game=undefined;
    });
  });
});
