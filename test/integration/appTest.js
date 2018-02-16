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
      app.games = [];
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
      app.games = [new Game()];
      app.games[0].addPlayer();
    });
    it('responds false if opponent is not present', function (done) {
      request(app)
        .get('/hasOpponentJoined')
        .expect(200)
        .expect(/false/)
        .end(done);
    });
    after(()=>{
      app.games = [];
    });
  });

  describe('GET /hasOpponentJoined', function () {
    before(()=>{
      app.games = [new Game()];
      app.games[0].addPlayer();
      app.games[0].addPlayer();
    });
    it('responds true if opponent is present', function (done) {
      request(app)
        .get('/hasOpponentJoined')
        .expect(200)
        .expect(/true/)
        .end(done);
    });
    after(()=>{
      app.games = [];
    });
  });

});
