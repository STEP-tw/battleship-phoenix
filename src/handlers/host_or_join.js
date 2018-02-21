const hostOrJoin = function(req,res){
  let game = req.app.game;
  let gameStatus = {areTwoPlayers: game && game.hasTwoPlayers()};
  res.json(gameStatus);
};

exports.hostOrJoin = hostOrJoin;
