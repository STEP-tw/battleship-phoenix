const Fleet = require('../models/fleet.js');

const startGame=function(req,res){
  let game = req.app.game ;
  if (game && game.hasTwoPlayers()) {
    let content=req.app.fs.readFileSync('./public/game.html','utf8');
    content=content.replace('Place your ships','game started');
    res.send(content);
    return;
  }
  res.end("need players");
};

const loadFleet = function(req,res) {
  let fleet = new Fleet();
  let shipsHeadPositions = JSON.parse(req.body.fleetDetails);
  shipsHeadPositions.forEach(function(shipInfo) {
    let direction = shipInfo.dir;
    let headPos = shipInfo.headPos;
    let size = shipInfo.length;
    fleet.addShip(direction,headPos,size);
  });
  res.send(shipsHeadPositions);
  res.end();
};


exports.startGame=startGame;
exports.loadFleet=loadFleet;
