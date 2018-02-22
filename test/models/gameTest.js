const assert = require('chai').assert;
const Game = require('./../../src/models/game.js');
const Player = require('./../../src/models/player.js');
const Fleet = require('./../../src/models/fleet.js');

let game;
describe('Game', () => {
  beforeEach(function () {
    game = new Game;
  });
  describe('get playerCount',()=> {
    it('should give no: of players',()=> {
      assert.equal(game.playerCount,0);
    });
  });
  describe('addPlayer', () => {
    it('should add a new player with Id 1', () => {
      let game=new Game();
      game.addPlayer('player1',1);
      let actual=game.players;
      let expected=[{_id: 1,_fleet:undefined,_ready:false,_name: 'player1'}];
      assert.deepEqual(actual, expected);
    });
  });
  describe('hasTwoPlayers', () => {
    it('should return true when game has two players', () => {
      let game=new Game();
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
      let actual=game.hasTwoPlayers();
      assert.ok(actual);
    });
  });
  describe('updateStatus', () => {
    it('should update game status when second player has joined',() => {
      game.updateStatus("ready to start");
      let actual = game.status;
      let expected = true;
      assert.equal(actual,expected);
    });
  });
  describe('changePlayerStatus', () => {
    it('should change player status to ready',() => {
      let game=new Game();
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
      game.changePlayerStatus(1);
      game.changePlayerStatus(2);
      assert.ok(game.arePlayersReady());
    });
  });
  describe('getPlayer', () => {
    it('should give the player given its Id',() => {
      let game=new Game();
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
      let actual = game.getPlayer(1);
      let expected= new Player(1,'arvind');
      assert.deepEqual(actual,expected);
    });
  });
  describe('arePlayersReady', () => {
    it('should give true if both the players are ready',() => {
      let game=new Game();
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
      game.assignFleet(1,{});
      game.changePlayerStatus(1);
      game.changePlayerStatus(2);
      game.assignFleet(2,{});
      assert.isOk(game.arePlayersReady());
    });
    it('should give false if both the players are not ready',() => {
      let game=new Game();
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
      game.assignFleet(1,{});
      game.changePlayerStatus(1);
      assert.isNotOk(game.arePlayersReady());
    });
  });
  describe('assignFleet', () => {
    it('should assign fleet to the player',() => {
      let playerId = 1;
      let fleet = [
        {direction:"south",size:3,initialPos:'og_1_2',posOfDamage:[]},
        {direction:"south",size:3,initialPos:'og_1_2',posOfDamage:[]}];
      game.addPlayer('arvind',1);
      game.assignFleet(playerId,fleet);
      let actual = game.getFleet(playerId);
      assert.deepEqual(actual,fleet);
    });
  });
  describe('checkOpponentIsHit', function () {
    it('should return true when the opponents ship is hit', function () {
      let game = new Game();
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
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
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
      let fleet = new Fleet();
      let subShipInfo = {dir:'south',length:4,headPos:[2,3]};
      fleet.addShip(subShipInfo);
      game.assignFleet(1,fleet);
      game.assignFleet(2,fleet);
      let actual = game.checkOpponentIsHit(1,[1,2]);
      assert.isNotOk(actual);
    });
  });
  describe('get turn', function () {
    it('should get currentPlayerIndex', function () {
      assert.equal(game.turn,undefined);
    });
  });
  describe('assignTurn', function () {
    it('should assign 0 to current player for nos < 0.5', function () {
      game.assignTurn(0.4);
      assert.equal(game.turn, 0);
    });
    it('should assign 1 to currentplayer for nos = 0.5', function () {
      game.assignTurn(0.5);
      assert.equal(game.turn, 1);
    });
    it('should assign 1 to currentplayer for nos > 0.5', function () {
      game.assignTurn(0.6);
      assert.equal(game.turn, 1);
    });
  });
  describe('getOpponentPlayerID', function () {
    it('should give the opponent playerID according to the current playerId',
      function () {
        let game=new Game();
        game.addPlayer('ishu',1);
        game.addPlayer('arvind',2);
        game.assignFleet(1,{});
        game.assignFleet(2,{});
        assert.equal(game.getOpponentPlayerId(1),2);
        assert.equal(game.getOpponentPlayerId(2),1);
      });
  });
});
