/*eslint-disable max-lines*/
const assert = require('chai').assert;
const Game = require('./../../src/models/game.js');
const Player = require('./../../src/models/player.js');
const Fleet = require('./../../src/models/fleet.js');

let game;
describe('Game', () => {
  beforeEach(function() {
    game = new Game(1,true);
  });
  describe('hostName', function () {
    it('should return the host\'s name', function () {
      game.addPlayer('arjun',1);
      assert.equal(game.hostName,'arjun');
    });
  });
  describe('addPlayer', () => {
    it('should add a new player with Id 1', () => {
      game.addPlayer('player1', 1);
      let actual = game.getCurrentPlayer(1);
      let expected = {
        _id: 1,
        _fleet: {
          _ships:[]},
        _ready: false,
        _shots: {
          hits: [],
          misses: []
        },
        _name: 'player1'
      };
      assert.deepEqual(actual, expected);
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
        name: "destroyer",
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
  describe('statusAfterShotIsFired', function() {
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
      assert.ok(game.statusAfterShotIsFired(1));
    });
    it('it should return false when other player is not lost', function() {
      let fleet = {
        hasAllShipsSunk: () => {
          return false;
        }
      };
      game.assignFleet(2, fleet);
      assert.isNotOk(game.statusAfterShotIsFired(1));
    });
  });
  describe('statusDuringOpponentTurn', function() {
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
      assert.ok(game.statusDuringOpponentTurn(1));
    });
    it('it should return false when other player is not won', function() {
      let fleet = {
        hasAllShipsSunk: () => {
          return false;
        }
      };
      game.assignFleet(1, fleet);
      assert.isNotOk(game.statusDuringOpponentTurn(1));
    });
  });
  describe('updatePlayerShot', function() {
    beforeEach(function() {
      let fleet = new Fleet();
      let subShipInfo = {
        dir: 'south',
        name: "destroyer",
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
  describe('isAlreadyFired', function() {
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
      assert.ok(game.isAlreadyFired(1, [1, 2]));
    });
    it('should return false when fired once', function() {
      game.updatePlayerShot(1, [1, 2]);
      assert.isNotOk(game.isAlreadyFired(1, [3, 2]));
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
  describe('removePlayer', () => {
    beforeEach(function() {
      game.addPlayer('arvind', 1);
      game.addPlayer('ishu', 2);
      game.assignFleet(1, {});
      game.assignFleet(2, {});
    });
    it('should remove player from player list', () => {
      game.removePlayer(1);
      assert.equal(game.getOpponentPlayer(2),undefined);
    });
  });
  describe('updateLastShot', function() {
    beforeEach(function() {
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.updateLastShot(1,[1,2],true);
    });
    it('should update the last shot of the current player', function() {
      let player = game.getPlayer(1);
      let actual = player.getLastShot();
      let expected = {shot:[1,2],status:true};
      assert.deepEqual(actual , expected);
    });
  });
  describe('getOpponentLastShot', function() {
    beforeEach(function() {
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.updateLastShot(1,[1,2],true);
    });
    it('should return last shot of opponent', function() {
      let actual = game.getOpponentLastShot(2);
      let expected = {shot:[1,2],status:true};
      assert.deepEqual(actual , expected);
    });
  });
  describe('getOpponentSunkShipsCoords', function() {
    it('should update the shots of the player', function() {
      let fleet = new Fleet();
      let subShipInfo = {
        dir: 'south',
        name: "destroyer",
        headPos: [2, 3]
      };
      fleet.addShip(subShipInfo);
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
      game.updatePlayerShot(2, [2, 3]);
      game.updatePlayerShot(2, [2, 4]);

      let actual = game.getOpponentSunkShipsCoords(1);
      let expected=[[[ 2,3],[2,4]]];
      assert.deepEqual(actual, expected);
    });
  });
  describe('hasOpponentLeft', function() {
    beforeEach(function() {
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.removePlayer(1);
    });
    it('should return true if opponent leaves', function() {
      let actual = game.hasOpponentLeft(2);
      assert.ok(actual);
    });
  });
  describe('getid', function() {
    it('should give the id of the game', function() {
      let actual = game.id;
      assert.equal(actual,1);
    });
  });
  describe('isCurrentPlayer', function() {
    beforeEach(function() {
      game.addPlayer('sudhin', 1);
      game.addPlayer('sridev', 2);
      game.assignTurn(0.4);
    });
    it('should return true if it is currentplayer', function() {
      assert.isOk(game.isCurrentPlayer(1));
    });
  });
  describe('getChangedTurnStatus in classic mode', function() {
    beforeEach(function() {
      game.addPlayer('sudhin', 1);
      game.addPlayer('sridev', 2);
      game.assignTurn(0.4);
      game.changeTurn();
    });
    it('should return true if it is currentplayer and it is a miss', function(){
      assert.isTrue(game.getChangedTurnStatus(1,true));
    });
  });

  describe('getChangedTurnStatus in classic+ mode', function() {
    beforeEach(function() {
      game=new Game(1,false);
      game.addPlayer('sudhin', 1);
      game.addPlayer('sridev', 2);
      game.assignTurn(0.4);
      game.changeTurn();
    });
    it('should return true if it is currentplayer and it is a miss', function(){
      assert.isTrue(game.getChangedTurnStatus(1,true));
    });
    it('should return false if it is currentplayer and it is a hit', function(){
      assert.isNotOk(game.getChangedTurnStatus(1,false));
    });
  });

  describe('getGameStatus', function() {
    beforeEach(function() {
      let fleet = new Fleet();
      let subShipInfo = {
        dir: "south",
        name:"carrier",
        headPos: [1, 2]
      };
      fleet.addShip(subShipInfo);
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
      game.updatePlayerShot(1, [1, 2]);
    });
    it('should return the status of game', function() {
      let actual = game.getGameStatus(2);
      let expected ={
        "fleet": [{
          "direction": "south",
          "name":"carrier",
          "length":5,
          "initialPos": [1, 2],
          "posOfDamage": [[1,2]]
        }],
        "playerShots": {
          "hits": [],
          "misses": []
        },
        "opponentMisses": [],
        "opponentHits": [[1,2]],
        playerName: 'arvind',
        enemyName: 'ishu',
        destroyedShipsCoords: []
      };
      assert.deepEqual(actual, expected);
    });
  });
  describe('getStatusAfterShotIsFired in classic mode', function() {
    beforeEach(function() {
      let fleet = new Fleet();
      let subShipInfo = {
        dir: "south",
        name:"carrier",
        headPos: [1, 2]
      };
      fleet.addShip(subShipInfo);
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
      game.assignTurn(0.4);
      game.changeTurn();
      game.updatePlayerShot(1, [1, 2]);
    });
    it('should return the status after shot is fired', function() {
      let actual = game.getStatusAfterShotIsFired(2,[1,2],true);
      let expected ={
        firedPos:[1,2],
        status:true,
        winStatus:false,
        myTurn:false,
        destroyedShipsCoords:[],
        sound:true
      };
      assert.deepEqual(actual, expected);
    });
  });

  describe('getStatusAfterShotIsFired in classic+ mode', function() {
    beforeEach(function() {
      let fleet = new Fleet();
      let subShipInfo = {
        dir: "south",
        name:"carrier",
        headPos: [1, 2]
      };
      game=new Game(1,false);
      fleet.addShip(subShipInfo);
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
      game.assignTurn(0.4);
      game.changeTurn();
      game.updatePlayerShot(1, [1, 2]);
    });
    it('should return the status after shot is fired', function() {
      let actual = game.getStatusAfterShotIsFired(2,[1,2],true);
      let expected ={
        firedPos:[1,2],
        status:true,
        winStatus:false,
        myTurn:true,
        destroyedShipsCoords:[],
        sound:true
      };
      assert.deepEqual(actual, expected);
    });
    it('should return the status false after shot is fired and its miss', ()=>{
      let actual = game.getStatusAfterShotIsFired(2,[1,1],true);
      let expected ={
        firedPos:[1,1],
        status:false,
        winStatus:false,
        myTurn:false,
        destroyedShipsCoords:[],
        sound:true
      };
      assert.deepEqual(actual, expected);
    });
  });

  describe('getStatusDuringOpponentTurn in classic mode', function() {
    beforeEach(function() {
      let fleet = new Fleet();
      let subShipInfo = {
        dir: "south",
        name:"carrier",
        headPos: [1, 2]
      };
      fleet.addShip(subShipInfo);
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
      game.assignTurn(0.4);
      game.changeTurn();
      game.updatePlayerShot(1, [1, 2]);
    });
    it('should return the status after shot is fired', function() {
      let actual = game.getStatusDuringOpponentTurn(2,true);
      let expected ={
        status:false,
        myTurn:true,
        opponentShots:{hits:[[1,2]],misses:[]},
        lastShot:undefined,
        sound:true
      };
      assert.deepEqual(actual, expected);
    });
  });

  describe('getPlayerPerformance', function() {
    it('should return the total shots,hits and accuracy of the player',()=>{
      let fleet = new Fleet();
      let subShipInfo = {
        dir: 'south',
        name: "destroyer",
        headPos: [2, 3]
      };
      fleet.addShip(subShipInfo);
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
      game.updatePlayerShot(2, [2, 3]);
      game.updatePlayerShot(2, [2, 4]);
      let actual = game.getPlayerPerformance(2);
      let expected={shots:2,hits:2,accuracy:100};
      assert.deepEqual(actual, expected);
    });
  });

  describe('getStatusDuringOpponentTurn in classic+ mode', function() {
    beforeEach(function() {
      let fleet = new Fleet();
      let subShipInfo = {
        dir: "south",
        name:"carrier",
        headPos: [1, 2]
      };
      game=new Game(1,false);
      fleet.addShip(subShipInfo);
      game.addPlayer('ishu', 1);
      game.addPlayer('arvind', 2);
      game.assignFleet(1, fleet);
      game.assignFleet(2, fleet);
      game.assignTurn(0.4);
    });
    it('should return the status after shot is fired', function() {
      game.getStatusAfterShotIsFired(1, [1, 2],true);
      let actual = game.getStatusDuringOpponentTurn(2,true);
      let expected ={
        status:false,
        myTurn:false,
        opponentShots:{hits:[[1,2]],misses:[]},
        lastShot:{
          shot:[1,2],
          status:true
        },
        sound:true
      };
      assert.deepEqual(actual, expected);
    });
    it('should return the status after shot is fired', function() {
      game.getStatusAfterShotIsFired(1, [3, 1],true);
      let actual = game.getStatusDuringOpponentTurn(2,true);
      let expected ={
        status:false,
        myTurn:true,
        opponentShots:{hits:[],misses:[[3,1]]},
        lastShot:{
          shot:[3,1],
          status:false
        },
        sound:true
      };
      assert.deepEqual(actual, expected);
    });
  });
});
