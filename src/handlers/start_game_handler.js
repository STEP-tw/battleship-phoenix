const startGame=function(req,res){
  let game = req.app.game ;
  if (game && game.hasTwoPlayers()) {
    res.send('Game started');
    return;
  }
  res.end('Need Game and players');
};
exports.startGame=startGame;
