const assert = require('chai').assert;
const RandomPositioner = require('../../src/models/random_positioner.js');

describe('randomPositioner',()=>{
  let randomPositioner;
  beforeEach(()=>{
    randomPositioner = new RandomPositioner(0,10);
  });
  describe('randomDirection',()=>{
    it('should return a north',()=>{
      const rand = ()=>0.2;
      let actual = randomPositioner.randomDirection(rand);
      assert.equal(actual,'north');
    });

    it('should return a south',()=>{
      const rand = ()=>0.4;
      let actual = randomPositioner.randomDirection(rand);
      assert.equal(actual,'south');
    });

    it('should return a west',()=>{
      const rand = ()=>0.6;
      let actual = randomPositioner.randomDirection(rand);
      assert.equal(actual,'west');
    });

    it('should return a east',()=>{
      const rand = ()=>0.9;
      let actual = randomPositioner.randomDirection(rand);
      assert.equal(actual,'east');
    });
  });

  describe('randomHeadPosition',()=>{
    it('should return valid headPosition within given grid limits',()=>{
      const rand = ()=>0.6;
      let actual = randomPositioner.randomHeadPosition(0,10,rand);
      assert.deepEqual([6,6],actual);
    });

    it('should return valid headPosition should be within grid',()=>{
      const rand = ()=>0.5;
      let actual = randomPositioner.randomHeadPosition(0,10,rand);
      assert.notDeepEqual([3,3],actual);
    });

    it('should return valid headPosition should be within grid',()=>{
      const rand = ()=>0.3;
      let actual = randomPositioner.randomHeadPosition(0,10,rand);
      assert.notDeepEqual([5,6],actual);
    });
  });

  describe('randomFleetPosition',()=>{
    it(`should return random headPosition and
    direction with fleet`,()=>{
      const rand = ()=>(0.9);
      randomPositioner.fleet = [{name:'carrier'},{name:'battleship'}];
      let actual = randomPositioner.randomFleetPosition(0,10,rand);
      let expected = [{name:'carrier',direction:'east',initialPos: [9,9]},
        {name:'battleship', direction: 'east',initialPos: [9,9]} ];
      assert.deepEqual(actual,expected);
    });
  });

  describe('genValidRandomFleet',()=>{
    it('should throw error on invalid fleet position',(done)=>{
      const rand = ()=>{
        return 0.2;
      };
      let randomPositioner = new RandomPositioner(0,10);
      randomPositioner.fleet = [{name:'carrier'},{name:'battleship'}];
      assert.throws(()=>
        randomPositioner.genValidRandomFleet(0,10,rand,RangeError));
      done();
    });
    it('should return valid fleet position',()=>{
      const rand = ()=>{
        return 0.4;
      };
      let randomPositioner = new RandomPositioner(0,10);
      randomPositioner.fleet = [{name:'carrier'}];
      let actual = randomPositioner.genValidRandomFleet(0,10,rand);
      let expected = [{name:'carrier',direction:'south',initialPos: [4,4]}];
      assert.deepEqual(expected,actual);
    });
  });
});
