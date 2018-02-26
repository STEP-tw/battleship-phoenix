const assert = require('chai').assert;
const Player = require('./../../src/models/player.js');
const Fleet = require('./../../src/models/fleet.js');

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
  describe('isHit', () => {
    it('should return true when fleet any ship hit by opponent', () => {
      let player1=new Player(1,'player1');
      let fleet = new Fleet();
      let subShipInfo = {dir:'south',length:4,headPos:[2,3]};
      fleet.addShip(subShipInfo);
      player1.addFleet(fleet);
      let actual = player1.isHit([2,3]);
      assert.ok(actual);
    });
    it('should return false when fleet any ship is not hit by opponent', () => {
      let player1=new Player(1,'player1');
      let fleet = new Fleet();
      let subShipInfo = {dir:'south',length:4,headPos:[2,3]};
      fleet.addShip(subShipInfo);
      player1.addFleet(fleet);
      let actual = player1.isHit([1,2]);
      assert.isNotOk(actual);
    });
  });
  describe('shots', () => {
    it('should give all the shots of player', () => {
      let player=new Player(1,'player');
      let actual=player.shots;
      let expected={hits:[],misses:[]};
      assert.deepEqual(actual, expected);
    });
  });
  describe('updateShot', () => {
    it('should update the hit and miss shots of player', () => {
      let player=new Player(1,'player');
      player.updateShot('hits',[1,2]);
      let actual = player.shots;
      let expected={hits:[[1,2]],misses:[]};
      assert.deepEqual(actual, expected);
    });
  });
  describe('isItYourTurn', function () {
    let player = new Player(123);
    it('should give true if given id is his id', function () {
      assert.isTrue(player.isItYourId(123));
    });
    it('should give false if its not his id', function () {
      assert.isFalse(player.isItYourId(12));
    });
  });
});
