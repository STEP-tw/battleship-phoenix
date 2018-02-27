const assert = require('chai').assert;
const Game = require('./../../src/models/game.js');
const Player = require('./../../src/models/player.js');
const Fleet = require('./../../src/models/fleet.js');

let game;
describe('Game', () => {
  beforeEach(function() {
    game = new Game();
  });
  describe('get playerCount', () => {
    it('should give no: of players', () => {
      assert.equal(game.playerCount, 0);
    });
  });
  describe('addPlayer', () => {
    it('should add a new player with Id 1', () => {
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
      game.addPlayer('arvind', 1);
      game.addPlayer('ishu', 2);
      let actual = game.hasTwoPlayers();
      assert.ok(actual);
    });
  });
  describe('changePlayerStatus', () => {
    it('should change player status to ready', () => {
      game.addPlayer('arvind', 1);
      game.addPlayer('ishu', 2);
      game.changePlayerStatus(1);
      game.changePlayerStatus(2);
      assert.ok(game.arePlayersReady());
    });
  });
  describe('getPlayer', () => {
    it('should give the player given its Id', () => {
      game.addPlayer('arvind', 1);
      game.addPlayer('ishu', 2);
      let actual = game.getPlayer(1);
      let expected = new Player(1, 'arvind');
      assert.deepEqual(actual, expected);
    });
  });
  describe('arePlayersReady', () => {
    beforeEach(function() {
      game.addPlayer('arvind', 1);
      game.addPlayer('ishu', 2);
      game.assignFleet(1, {});
      game.assignFleet(2, {});
    });
    it('should give true if both the players are ready', () => {
      game.changePlayerStatus(1);
      game.changePlayerStatus(2);
      assert.isOk(game.arePlayersReady());
    });
    it('should give false if both the players are not ready', () => {
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
  describe('checkOpponentIsHit', function() {
    beforeEach(function() {
      game.addPlayer('arvind', 1);
      game.addPlayer('ishu', 2);
      let fleet = new Fleet();
      let subShipInfo = {
        dir: 'south',
        length: 4,
        headPos: [2, 3]
      };
      fleet.addShip(subShipInfo);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
    });
    it('should return true when the opponents ship is hit', function() {
      let actual = game.checkOpponentIsHit(1, [2, 3]);
      assert.ok(actual);
    });
    it('should return false when the opponents ship is not hit', function() {
      let actual = game.checkOpponentIsHit(1, [1, 2]);
      assert.isNotOk(actual);
    });
  });
  describe('get turn', function() {
    it('should get currentPlayerIndex', function() {
      assert.equal(game.turn, undefined);
    });
  });
  describe('assignTurn', function() {
    it('should assign 0 to current player for nos < 0.5', function() {
      game.assignTurn(0.4);
      assert.equal(game.turn, 0);
    });
    it('should assign 1 to currentplayer for nos = 0.5', function() {
      game.assignTurn(0.5);
      assert.equal(game.turn, 1);
    });
    it('should assign 1 to currentplayer for nos > 0.5', function() {
      game.assignTurn(0.6);
      assert.equal(game.turn, 1);
    });
  });
  describe('hasOpponentLost', function() {
    beforeEach(function() {
      game.addPlayer('mani', 1);
      game.addPlayer('Dhana', 2);
    });
    it('it should return true when other player lost', function() {
      let fleet = {
        hasAllShipsSunk: () => {
          return true;
        }
      };
      game.assignFleet(2, fleet);
      assert.ok(game.hasOpponentLost(1));
    });
    it('it should return false when other player is not lost', function() {
      let fleet = {
        hasAllShipsSunk: () => {
          return false;
        }
      };
      game.assignFleet(2, fleet);
      assert.isNotOk(game.hasOpponentLost(1));
    });
  });
  describe('hasOpponentWon', function() {
    beforeEach(function() {
      game.addPlayer('mani', 1);
      game.addPlayer('Dhana', 2);
    });
    it('it should return true when other player won', function() {
      let fleet = {
        hasAllShipsSunk: () => {
          return true;
        }
      };
      game.assignFleet(1, fleet);
      assert.ok(game.hasOpponentWon(1));
    });
    it('it should return false when other player is not won', function() {
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
      function() {
        game.addPlayer('ishu', 1);
        game.addPlayer('arvind', 2);
        game.assignFleet(1, {});
        game.assignFleet(2, {});
        assert.equal(game.getOpponentPlayerId(1), 2);
        assert.equal(game.getOpponentPlayerId(2), 1);
      });
  });
  describe('updatePlayerShot', function() {
    beforeEach(function() {
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
    });
    it('should update the shots of the player', function() {
      game.updatePlayerShot(1, [1, 2]);
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
      game.updatePlayerShot(1, [2, 3]);
      let player = game.getPlayer(1);
      let actual = player.shots;
      let expected = {
        hits: [
          [2, 3]
        ],
        misses: []
      };
      assert.deepEqual(actual, expected);
    });
  });
  describe('getOpponentShots', function() {
    it('should update the shots of the player', function() {
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
      game.updatePlayerShot(2, [1, 2]);
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
  describe('changeTurn', function() {
    beforeEach(function() {
      game.addPlayer('sudhin', 1);
      game.addPlayer('sridev', 2);
    });
    it('should toggle the turn from player 1 from to player 2', function() {
      game.assignTurn(0.4);
      game.changeTurn();
      assert.equal(game.turn, 1);
    });
    it('should toggle the turn from player 2 from to player 1', function() {
      game.assignTurn(0.6);
      game.changeTurn();
      assert.equal(game.turn, 0);
    });
  });
  describe('validateId', function() {
    beforeEach(function() {
      game.addPlayer('sudhin', 1);
      game.addPlayer('arvind', 2);
    });
    it('should return true given validId', function() {
      assert.ok(game.validateId(0, 1));
      assert.ok(game.validateId(1, 2));
    });
    it('should return false given invalidID', function() {
      assert.isNotOk(game.validateId(0, 34));
      assert.isNotOk(game.validateId(1, 43));
    });
  });
  describe('isAlreadFired', function() {
    beforeEach(function() {
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
    });
    it('should return true if refires at same pos', function() {
      game.updatePlayerShot(1, [1, 2]);
      assert.ok(game.isAlreadFired(1, [1, 2]));
    });
    it('should return false when fired once', function() {
      game.updatePlayerShot(1, [1, 2]);
      assert.isNotOk(game.isAlreadFired(1, [3, 2]));
    });
  });
  describe('getSankOpponentShipsCount', function() {
    it('should give details of sank ships of opponent', function() {
      let fleet = new Fleet();
      let subShipInfo = {
        dir: 'south',
        length: 2,
        headPos: [0, 0]
      };
      fleet.addShip(subShipInfo);
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
      game.updatePlayerShot(1, [0, 0]);
      game.updatePlayerShot(1, [0, 1]);
      assert.equal(game.getSankOpponentShipsCount(1), 1);
    });
  });
  describe('getCurrentPlayerShots', function() {
    beforeEach(function() {
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
    });
    it('should give the current player shots', function() {
      let shots = game.getCurrentPlayerShots(2);
      let expected = {
        hits: [],
        misses: []
      };
      assert.deepEqual(shots, expected);
    });
  });
});
