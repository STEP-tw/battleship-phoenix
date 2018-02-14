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
});
