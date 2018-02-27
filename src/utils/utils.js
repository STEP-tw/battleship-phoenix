let utils={};

utils.changeIndex = function (randomIndex) {
  return 1 - randomIndex;
};

utils.generateTurn = (random)=> {
  let turns = [0,1];
  let randomIndex = Math.round(random);
  return [turns[randomIndex],turns[utils.changeIndex(randomIndex)]];
};

utils.getGame = function (req) {
  return req.app.game;
};

utils.getPlayerId = function (req) {
  return req.cookies.player;
};

utils.getUsername = function (req) {
  return req.body.username;
};

utils.getAuthorizedUrls = function () {
  return ['/game.html'];
};

utils.isItPrivilegedData = function (url) {
  return utils.getAuthorizedUrls().includes(url);
};

utils.isUserTresspassing=function (req) {
  let userName = utils.getPlayerId(req);
  let url = req.url;
  let validUrls = utils.getAuthorizedUrls();
  return !userName && utils.isItPrivilegedData(url);
};

module.exports = utils;
