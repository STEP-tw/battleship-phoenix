const assert = require('chai').assert;
const Game = require('./../../src/models/game.js');
const Player = require('./../../src/models/player.js');
const Fleet = require('./../../src/models/fleet.js');

describe('Game', () => {
  describe('addPlayer', () => {
    it('should add a new player with Id 1', () => {
      let game=new Game();
      game.addPlayer('player1');
      let actual=game.players;
      let expected={
        '1': {_id: 1,_fleet:undefined,_ready:false,_name: 'player1'}};
      assert.deepEqual(actual, expected);
    });
  });
  describe('getTurn', () => {
    it('should give the name of the current player', () => {
      let game=new Game();
      game.addPlayer('player1');
      game.addPlayer('player2');
      let actual=game.getTurn();
      let expected="player1";
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
      game.updateStatus("ready to start");
      let actual = game.status;
      let expected = true;
      assert.equal(actual,expected);
    });
  });
  describe('changePlayerStatus', () => {
    it('should change player status to ready',() => {
      let game=new Game();
      game.addPlayer();
      game.addPlayer();
      game.changePlayerStatus(1);
      game.changePlayerStatus(2);
      assert.ok(game.arePlayersReady());
    });
  });
  describe('getPlayer', () => {
    it('should give the player given its Id',() => {
      let game=new Game();
      game.addPlayer();
      game.addPlayer();
      let actual = game.getPlayer(1);
      let expected= new Player(1);
      assert.deepEqual(actual,expected);
    });
  });
  describe('arePlayersReady', () => {
    it('should give true if both the players are ready',() => {
      let game=new Game();
      game.addPlayer();
      game.addPlayer();
      game.assignFleet(1,{});
      game.changePlayerStatus(1);
      game.changePlayerStatus(2);
      game.assignFleet(2,{});
      assert.isOk(game.arePlayersReady());
    });
    it('should give false if both the players are not ready',() => {
      let game=new Game();
      game.addPlayer();
      game.addPlayer();
      game.assignFleet(1,{});
      game.changePlayerStatus(1);
      assert.isNotOk(game.arePlayersReady());
    });
  });
  describe('assignFleet', () => {
    it('should assign fleet to the player',() => {
      let game=new Game();
      let playerId = 1;
      let fleet = [
        {direction:"south",size:3,initialPos:'og_1_2',posOfDamage:[]},
        {direction:"south",size:3,initialPos:'og_1_2',posOfDamage:[]}];
      game.addPlayer();
      game.assignFleet(playerId,fleet);
      let actual = game.getFleet(playerId);
      assert.deepEqual(actual,fleet);
    });
  });
  describe('checkOpponentIsHit', function () {
    it('should return true when the opponents ship is hit', function () {
      let game = new Game();
      game.addPlayer();
      game.addPlayer();
      let fleet = new Fleet();
      let subShipInfo = {dir:'south',length:4,headPos:[2,3]};
      fleet.addShip(subShipInfo);
      game.assignFleet(1,fleet);
      game.assignFleet(2,fleet);
      let actual = game.checkOpponentIsHit(1,[2,3]);
      assert.ok(actual);
    });
    it('should return false when the opponents ship is not hit', function () {
      let game = new Game();
      game.addPlayer();
      game.addPlayer();
      let fleet = new Fleet();
      let subShipInfo = {dir:'south',length:4,headPos:[2,3]};
      fleet.addShip(subShipInfo);
      game.assignFleet(1,fleet);
      game.assignFleet(2,fleet);
      let actual = game.checkOpponentIsHit(1,[1,2]);
      assert.isNotOk(actual);
    });
  });
});
