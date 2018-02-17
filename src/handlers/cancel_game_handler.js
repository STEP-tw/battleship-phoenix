const cancelGame=function(req,res){
  req.app.game = undefined;
  res.send("done");
};
exports.cancelGame=cancelGame;
