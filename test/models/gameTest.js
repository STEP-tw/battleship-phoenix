const assert = require('chai').assert;
const Game = require('./../../src/models/game.js');
const Player = require('./../../src/models/player.js');
const Fleet = require('./../../src/models/fleet.js');

let game;
describe('Game', () => {
  beforeEach(function() {
    game = new Game;
  });
  describe('get playerCount', () => {
    it('should give no: of players', () => {
      assert.equal(game.playerCount, 0);
    });
  });
  describe('addPlayer', () => {
    it('should add a new player with Id 1', () => {
      let game = new Game();
      game.addPlayer('player1', 1);
      let actual = game.players;
      let expected = [{
        _id: 1,
        _fleet: undefined,
        _ready: false,
        _shots: {
          hits: [],
          misses: []
        },
        _name: 'player1'
      }];
      assert.deepEqual(actual, expected);
    });
  });
  describe('hasTwoPlayers', () => {
    it('should return true when game has two players', () => {
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
      let actual=game.hasTwoPlayers();
      assert.ok(actual);
    });
  });
  describe('changeStartedStatus', () => {
    it('should update game status when second player has joined', () => {
      game.changeStartedStatus();
      let actual = game.status;
      let expected = true;
      assert.equal(actual, expected);
    });
  });
  describe('changePlayerStatus', () => {
    it('should change player status to ready',() => {
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
      game.changePlayerStatus(1);
      game.changePlayerStatus(2);
      assert.ok(game.arePlayersReady());
    });
  });
  describe('getPlayer', () => {
    it('should give the player given its Id',() => {
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
      let actual = game.getPlayer(1);
      let expected = new Player(1, 'arvind');
      assert.deepEqual(actual, expected);
    });
  });
  describe('arePlayersReady', () => {
    it('should give true if both the players are ready',() => {
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
      game.assignFleet(1,{});
      game.changePlayerStatus(1);
      game.changePlayerStatus(2);
      game.assignFleet(2, {});
      assert.isOk(game.arePlayersReady());
    });
    it('should give false if both the players are not ready',() => {
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
      game.assignFleet(1,{});
      game.changePlayerStatus(1);
      assert.isNotOk(game.arePlayersReady());
    });
  });
  describe('assignFleet', () => {
    it('should assign fleet to the player', () => {
      let playerId = 1;
      let fleet = [{
        direction: "south",
        size: 3,
        initialPos: 'og_1_2',
        posOfDamage: []
      },
      {
        direction: "south",
        size: 3,
        initialPos: 'og_1_2',
        posOfDamage: []
      }
      ];
      game.addPlayer('arvind', 1);
      game.assignFleet(playerId, fleet);
      let actual = game.getFleet(playerId);
      assert.deepEqual(actual, fleet);
    });
  });
  describe('checkOpponentIsHit', function () {
    it('should return true when the opponents ship is hit', function () {
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
      let fleet = new Fleet();
      let subShipInfo = {
        dir: 'south',
        length: 4,
        headPos: [2, 3]
      };
      fleet.addShip(subShipInfo);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
      let actual = game.checkOpponentIsHit(1, [2, 3]);
      assert.ok(actual);
    });
    it('should return false when the opponents ship is not hit', function () {
      game.addPlayer('arvind',1);
      game.addPlayer('ishu',2);
      let fleet = new Fleet();
      let subShipInfo = {
        dir: 'south',
        length: 4,
        headPos: [2, 3]
      };
      fleet.addShip(subShipInfo);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
      let actual = game.checkOpponentIsHit(1, [1, 2]);
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
  describe('hasOpponentLost',function(){
    it('it should return true when other player lost',function(){
      game.addPlayer('mani',1);
      game.addPlayer('Dhana',2);
      let fleet = {
        hasAllShipsSunk: () => {
          return true;
        }
      };
      game.assignFleet(2, fleet);
      assert.ok(game.hasOpponentLost(1));
    });
    it('it should return false when other player is not lost',function(){
      game.addPlayer('mani',1);
      game.addPlayer('Dhana',2);
      let fleet = {
        hasAllShipsSunk: () => {
          return false;
        }
      };
      game.assignFleet(2, fleet);
      assert.isNotOk(game.hasOpponentLost(1));
    });
  });
  describe('hasOpponentWon',function(){
    it('it should return true when other player won',function(){
      game.addPlayer('mani',1);
      game.addPlayer('Dhana',2);
      let fleet = {
        hasAllShipsSunk: () => {
          return true;
        }
      };
      game.assignFleet(1, fleet);
      assert.ok(game.hasOpponentWon(1));
    });
    it('it should return false when other player is not won',function(){
      game.addPlayer('mani',1);
      game.addPlayer('Dhana',2);
      let fleet = {
        hasAllShipsSunk: () => {
          return false;
        }
      };
      game.assignFleet(1, fleet);
      assert.isNotOk(game.hasOpponentWon(1));
    });
  });
  describe('getOpponentPlayerID', function() {
    it('should give the opponent playerID according to the current playerId',
      function () {
        game.addPlayer('ishu',1);
        game.addPlayer('arvind',2);
        game.assignFleet(1,{});
        game.assignFleet(2,{});
        assert.equal(game.getOpponentPlayerId(1),2);
        assert.equal(game.getOpponentPlayerId(2),1);
      });
  });
  describe('updatePlayerShot', function() {
    it('should update the shots of the player', function() {
      let game = new Game();
      let fleet = new Fleet();
      let subShipInfo = {
        dir: 'south',
        length: 4,
        headPos: [2, 3]
      };
      fleet.addShip(subShipInfo);
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
      game.updatePlayerShot(1,[1,2]);
      let player = game.getPlayer(1);
      let actual = player.shots;
      let expected = {
        hits: [],
        misses: [
          [1, 2]
        ]
      };
      assert.deepEqual(actual, expected);
    });
    it('should update the hits of the player', function() {
      let game = new Game();
      let fleet = new Fleet();
      let subShipInfo = {
        dir: 'south',
        length: 4,
        headPos: [2, 3]
      };
      fleet.addShip(subShipInfo);
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
      game.updatePlayerShot(1,[2,3]);
      let player = game.getPlayer(1);
      let actual = player.shots;
      let expected = {
        hits: [[2,3]],
        misses: []
      };
      assert.deepEqual(actual, expected);
    });
  });
  describe('getOpponentShots', function() {
    it('should update the shots of the player', function() {
      let game = new Game();
      let fleet = new Fleet();
      let subShipInfo = {
        dir: 'south',
        length: 4,
        headPos: [2, 3]
      };
      fleet.addShip(subShipInfo);
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
      game.updatePlayerShot(2,[1,2]);
      let actual = game.getOpponentShots(1);
      let player = game.getPlayer(2);
      let expected = {
        hits: [],
        misses: [
          [1, 2]
        ]
      };
      assert.deepEqual(actual, expected);
    });
  });
  describe('changeTurn', function () {
    beforeEach(function () {
      game.addPlayer('sudhin',1);
      game.addPlayer('sridev',2);
    });
    it('should toggle the turn from player 1 from to player 2', function () {
      game.assignTurn(0.4);
      game.changeTurn();
      assert.equal(game.turn,1);
    });
    it('should toggle the turn from player 2 from to player 1', function () {
      game.assignTurn(0.6);
      game.changeTurn();
      assert.equal(game.turn,0);
    });
  });
});
