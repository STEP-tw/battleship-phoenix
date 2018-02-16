const Game = require('../models/game');

const createGame = function(req, res, games) {
  if (games.length==0) {
    let game = new Game();
    game.addPlayer();
    games.push(game);
  }
  if(games[0].hasTwoPlayers()){
    res.send("true");
    return;
  }
  res.send("false");
};
exports.createGame = createGame;
