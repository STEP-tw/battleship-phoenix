const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const app = require('../../app.js');

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
  describe('GET /hasOpponentPlayer', function () {
    before(function () {
      app.playerCount = 2;
    });
    it('responds true if opponent is present', function (done) {
      request(app)
        .get('/hasOpponentPlayer')
        .expect(200)
        .expect(/true/)
        .end(done);
    });
    after(function () {
      app.playerCount = 0;
    });
  });
  describe('GET /hasOpponentPlayer', function () {
    it('responds false if opponent is not present', function (done) {
      request(app)
        .get('/hasOpponentPlayer')
        .expect(200)
        .expect(/false/)
        .end(done);
    });
  });
  describe('GET /create-game', () => {
    it('adds 1st player and gives a joining message', (done) => {
      request(app)
        .get('/create-game')
        .expect("Welcome you are the first player")
        .end(done);
    });
  });
});
