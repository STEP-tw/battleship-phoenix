const assert = require('chai').assert;
const utils = require('./../../src/utils/utils.js');

describe('getPlayerId', function() {
  it('should returns the player cookie', function() {
    let req = {
      cookies: {
        "player": 2
      }
    };
    let playerId = utils.getPlayerId(req);
    assert.equal(playerId, 2);
  });
});

describe('getUserName', function() {
  it('should returns the player name', function() {
    let req = {
      body: {
        username: 'sridev'
      }
    };
    let playerName = utils.getUsername(req);
    assert.equal(playerName, 'sridev');
  });
});

describe('getAuthorizedUrls', function() {
  it('should returns the all authorised urls', function() {
    let authorisedUrls = utils.getAuthorizedUrls();
    assert.deepEqual(authorisedUrls,["/game.html", "/areplayersready"
      ,"/hasopponentwon", "/start-game", "/updatefiredshot","/cancel-game"
      ,"/positionsystem","/gamestatus","/hasopponentjoined"]);
  });
});

describe('isItPrivilegedData', function() {
  it('should returns false for a given unauthorised urls', function() {
    let url = '/index.html';
    assert.isFalse(utils.isItPrivilegedData(url));
  });
  it('should returns true for a given authorised urls', function() {
    let url = '/game.html';
    assert.isTrue(utils.isItPrivilegedData(url));
  });
});
describe('isUserTresspassing()', function() {
  let req;
  beforeEach(function () {
    let game = {
      id:2,
      getPlayer: () => {
        return 'teja';
      }
    };
    req = {
      url: '/game.html',
      body: {gameId:2},
      cookies: {
        player: 'teja'
      },
      app: {
        gamesHandler: {
          _runningame: [game],
          _hostedgame:[game],
          fetchRunningGame: ()=>{
            return game;
          },
          fetchHostedGame: ()=>{
            return game;
          }
        }
      }
    };
  });
  it('should return true if user trying to access unpermitted data'
    , function() {
      req.app.gamesHandler.fetchRunningGame = ()=>{
        return false;
      };
      req.app.gamesHandler.fetchHostedGame = ()=>{
        return false;
      };
      assert.isTrue(utils.isUserTresspassing(req));
    });
  it('should return false if user trying to access permitted data'
    , function() {
      assert.isUndefined(utils.isUserTresspassing(req));
      req.url = '/index.html';
      assert.isNotOk(utils.isUserTresspassing(req));
    });
});

describe('isClassicGame', function() {
  it('should return true where game is Classic', function() {
    let req = {
      cookies: {
        "player": 2,
        "isClassicGame":"true"
      }
    };
    assert.isTrue(utils.isClassicGame(req));
  });
  it('should return false where game is not classic', function() {
    let req = {
      cookies: {
        "player": 2,
        "isClassicGame":"false"
      }
    };
    assert.isFalse(utils.isClassicGame(req));
  });
});
