const assert = require('chai').assert;
// const assert = chai.assert;
const Game = require('./../../src/models/game.js');

describe('Game', () => {
  describe('addPlayer', () => {
    it('should add a new player with Id 1', () => {
      let game=new Game();
      game.addPlayer();
      let actual=game.players;
      let expected={'1': {_id: 1}};
      assert.deepEqual(actual, expected);
    });
  });
});
