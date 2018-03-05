/*eslint-disable max-len*/
const assert = require('chai').assert;
const app = require('../../app.js');
const request = require('supertest');

describe('app', () => {
  describe('POST /host', () => {
    it('responds with name can not be empty if username is not given', (done) => {
      request(app)
        .post('/host')
        .send({username:''})
        .expect({"error":"Name can not be empty"})
        .end(done);
    });
    it('responds with Invalid username if username includes only special charaters',(done)=>{
      request(app)
        .post('/host')
        .send({username:'^&()'})
        .expect({"error":"Invalid username"})
        .end(done);
    });
    it('responds with Invalid username if username includes special charaters and numbers', (done) => {
      request(app)
        .post('/host')
        .send({username:'^&()765658'})
        .expect({"error":"Invalid username"})
        .end(done);
    });
    it('responds with Invalid username if username includes special charaters and alphabets', (done) => {
      request(app)
        .post('/host')
        .send({username:'hk^&()'})
        .expect({"error":"Invalid username"})
        .end(done);
    });
    it('responds with Invalid username if username is more than 10 charaters', (done) => {
      request(app)
        .post('/host')
        .send({username:'niteshranjan'})
        .expect({"error":"Invalid username"})
        .end(done);
    });
    it('responds with Invalid username if username includes spaces', (done) => {
      request(app)
        .post('/host')
        .send({username:'nit sudh'})
        .expect({"error":"Invalid username"})
        .end(done);
    });
  });
  describe('POST /join', () => {
    it('responds with name can not be empty if username is not given', (done) => {
      request(app)
        .post('/join')
        .send({username:''})
        .expect({"error":"Name can not be empty"})
        .end(done);
    });
    it('responds with Invalid username if username includes only special charaters', (done) => {
      request(app)
        .post('/join')
        .send({username:'^&()'})
        .expect({"error":"Invalid username"})
        .end(done);
    });
    it('responds with Invalid username if username includes special charaters and numbers', (done) => {
      request(app)
        .post('/join')
        .send({username:'^&()765658'})
        .expect({"error":"Invalid username"})
        .end(done);
    });
    it('responds with Invalid username if username includes special charaters and alphabets', (done) => {
      request(app)
        .post('/join')
        .send({username:'hk^&()'})
        .expect({"error":"Invalid username"})
        .end(done);
    });
    it('responds with Invalid username if username is more than 10 charaters', (done) => {
      request(app)
        .post('/join')
        .send({username:'niteshranjan'})
        .expect({"error":"Invalid username"})
        .end(done);
    });
    it('responds with Invalid username if username includes spaces', (done) => {
      request(app)
        .post('/join')
        .send({username:'nit sudh'})
        .expect({"error":"Invalid username"})
        .end(done);
    });
  });
});
