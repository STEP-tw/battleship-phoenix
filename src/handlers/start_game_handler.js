const startGame=function(req,res){
  let game = req.app.game ;
  if (game && game.hasTwoPlayers()) {
    res.redirect('/index.html');
    return;
  }
  res.end();
};
exports.startGame=startGame;
