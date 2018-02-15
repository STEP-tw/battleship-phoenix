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
  describe('GET /gamepage',() => {
    it('responds with page contents', function (done) {
      request(app)
        .get('/gamepage')
        .expect(200)
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
});
