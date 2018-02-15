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
  describe('GET /create-game', () => {
    it('adds 1st player and gives a joining message', (done) => {
      request(app)
        .get('/create-game')
        .expect("Welcome you are the first player")
        .end(done);
    });
  });
});
