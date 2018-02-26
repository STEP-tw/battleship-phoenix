const Fleet = require('../models/fleet.js');

const startGame=function(req,res){
  let game = req.app.game;
  game.getPlayer(req.cookies.player).changeStatus();
  res.send(game.arePlayersReady());
};

const loadFleet = function(req,res) {
  let game=req.app.game;
  let fleet = new Fleet();
  let shipsHeadPositions = JSON.parse(req.body.fleetDetails);

  shipsHeadPositions.forEach(function(shipInfo) {
    let direction = shipInfo.dir;
    let headPos = shipInfo.headPos;
    let size = shipInfo.length;
    fleet.addShip(direction,headPos,size);
  });

  game.assignFleet(req.cookies.player,fleet);
  game.changePlayerStatus(req.cookies.player);
  res.send(shipsHeadPositions);
};

const arePlayersReady = function(req,res) {
  let text = `${ req.app.game && req.app.game.arePlayersReady()}`;
  res.send(text);
};

exports.arePlayersReady = arePlayersReady;
exports.startGame=startGame;
exports.loadFleet=loadFleet;
