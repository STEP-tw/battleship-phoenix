const Player = require('./../../src/models/player.js');
const assert = require('chai').assert;

describe('Player', () => {
  describe('getPlayerId', () => {
    it('should return player id that player has', () => {
      let player = new Player(1);
      assert.equal(player.playerId, 1);
    });
  });
  describe('hasFleetDestroyed', () => {
    it('should return true when all ship has sunk', () => {
      let player = new Player(1);
      let fleet = {
        hasAllShipsSunk:()=>{
          return true;
        }
      };
      player.addFleet(fleet);
      assert.ok(player.hasFleetDestroyed());
    });
    it('should return false when all ship has sunk', () => {
      let player = new Player(1);
      let fleet = {
        hasAllShipsSunk:()=>{
          return false;
        }
      };
      player.addFleet(fleet);
      assert.isNotOk(player.hasFleetDestroyed());
    });

  });
});
