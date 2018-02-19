const startGame=function(req,res){
  let game = req.app.game ;
  if (game && game.hasTwoPlayers()) {
    let content=req.app.fs.readFileSync('./public/index.html','utf8');
    content=content.replace('Place your ships','game started');
    res.send(content);
    return;
  }
  res.end("need players");
};
exports.startGame=startGame;
