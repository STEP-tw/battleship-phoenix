const assert = require('chai').assert;
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
  describe('hasTwoPlayers', () => {
    it('should return true when game has two players', () => {
      let game=new Game();
      game.addPlayer();
      game.addPlayer();
      let actual=game.hasTwoPlayers();
      assert.ok(actual);
    });
  });
  describe('updateStatus', () => {
    it('should update game status when second player has joined',() => {
      let game=new Game();
      game.addPlayer();
      game.addPlayer();
      game.addPlayer();
      let actual = game.status;
      let expected = "ready to start";
      assert.equal(actual,expected);
    });
  });
});
