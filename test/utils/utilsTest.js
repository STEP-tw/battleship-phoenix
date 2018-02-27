const assert = require('chai').assert;
const utils = require('./../../src/utils/utils.js');

describe('changeIndex', function () {
  it('should changeIndex from 1 to 0 and vice versa', function () {
    assert.deepEqual(utils.changeIndex(0),1);
    assert.deepEqual(utils.changeIndex(1),0);
  });
});

describe('generateTurn', function () {
  it('should give 1 or 2 in random', function () {
    assert.deepEqual(utils.generateTurn(0.4), [0,1]);
    assert.deepEqual(utils.generateTurn(0.6), [1,0]);
  });
});

describe('getPlayerId',function(){
  it('should returns the player cookie',function(){
    let req= {cookies:{"player":2}};
    let playerId = utils.getPlayerId(req);
    assert.equal(playerId,2);
  });
});

describe('getUserName',function(){
  it('should returns the player name',function(){
    let req= {body:{username:'sridev'}};
    let playerName = utils.getUsername(req);
    assert.equal(playerName,'sridev');
  });
});

describe('getAuthorizedUrls',function(){
  it('should returns the all authorised urls',function(){
    let authorisedUrls = utils.getAuthorizedUrls();
    assert.include(authorisedUrls,'/game.html');
  });
});

describe('isItPrivilegedData',function(){
  it('should returns false for a given unauthorised urls',function(){
    let url = '/index.html';
    assert.isFalse(utils.isItPrivilegedData(url));
  });
  it('should returns true for a given authorised urls',function(){
    let url = '/game.html';
    assert.isTrue(utils.isItPrivilegedData(url));
  });
});
describe('isUserTresspassing()',function(){
  it('should return true if user trying to access unpermitted data',function(){
    let req = {url:'/game.html',cookies:{}};
    assert.isTrue(utils.isUserTresspassing(req));
  });
  it('should return false if user trying to access permitted data',function(){
    let req1 = {url:'/game.html',cookies:{player:'teja'}};
    assert.isFalse(utils.isUserTresspassing(req1));
    let req2 = {url:'/index.html',cookies:{}};
    assert.isFalse(utils.isUserTresspassing(req2));
  });
});
