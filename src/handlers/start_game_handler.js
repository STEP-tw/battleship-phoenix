const startGame=function(req,res){
  let game = req.app.game;
  game.getPlayer(req.cookies.player).changeStatus();
  res.send(game.arePlayersReady());
};
exports.startGame=startGame;
