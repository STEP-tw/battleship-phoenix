const assert = require('chai').assert;
const Player = require('./../../src/models/player.js');

describe('Player', () => {
  describe('addPlayer', () => {
    it('should add a new player with Id 1', () => {
      let player1=new Player(1);
      let actual=player1.playerId;
      let expected=1;
      assert.equal(actual, expected);
    });
  });
  describe('getPlayerName', () => {
    it('should give the player name', () => {
      let player1=new Player(1,'player1');
      let actual=player1.playerName;
      let expected="player1";
      assert.equal(actual, expected);
    });
  });
  describe('getPlayerId', () => {
    it('should give the player Id', () => {
      let player1=new Player(1,'player1');
      let actual=player1.playerId;
      let expected='1';
      assert.equal(actual, expected);
    });
  });
  describe('getPlayerName', () => {
    it('should give the player name', () => {
      let player1=new Player(1,'player1');
      let actual=player1.playerName;
      let expected="player1";
      assert.equal(actual, expected);
    });
  });
});
