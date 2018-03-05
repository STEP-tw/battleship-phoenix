let utils = {};
let intervals=[];

utils.get = function () {
  return 'GET';
};

utils.post = function () {
  return 'POST';
};

utils.getResponse = function (xhr) {
  return JSON.parse(xhr.responseText);
};

utils.toS = function (content) {
  return JSON.stringify(content);
};

utils.updateMessage = function (content) {
  utils.getMessageBox().innerHTML = content;
};

utils.getTargetGrid = function () {
  return document.querySelector('#targetGrid');
};

utils.getOceanGrid = function () {
  return document.querySelector('#oceanGrid');
};

utils.getReadyButton = function () {
  return document.querySelector('#ready');
};

utils.getPopupBox = function () {
  return document.querySelector(".popup");
};

utils.getMessageBox = function () {
  return document.querySelector('.messageBox');
};

utils.setInterval = function (callback,time=1000) {
  let interval = setInterval(callback,time);
  intervals.push(interval);
};

utils.poll = function (method,reqUrl,callBackFunction,time=1000) {
  utils.setInterval(()=>{
    utils.sendAjax(method,reqUrl,callBackFunction);
  },time);
};

utils.clearIntervals = function () {
  intervals.forEach(function (interval) {
    clearInterval(interval);
  });
};

utils.clearLastInterval = function () {
  clearInterval(intervals.pop());
};

utils.getHostedGamesList = function () {
  return document.querySelector('#hostedGames');
};

utils.createButton = function (name) {
  let button = document.createElement('button');
  button.innerText = name;
  return button;
};

utils.createList = function (name) {
  let list = document.createElement('list');
  list.innerText = name;
  return list;
};

utils.createDiv = function (id) {
  let div = document.createElement('div');
  div.id = id;
  return div;
};

utils.sendAjax = function(method,url,callback,data="{}") {
  let req = new XMLHttpRequest();
  req.open(method,url);
  req.setRequestHeader('Content-Type','application/json');
  req.onload = callback;
  req.send(data);
};

utils.appendGame = function (hostedGamesList,game) {
  let button = utils.createButton('join');
  button.onclick = openJoinBlock;
  let gameName = utils.createList(`${game.hostName}'s game`);
  let gameDiv = utils.createDiv(game.gameId);
  gameDiv.appendChild(button);
  gameDiv.appendChild(gameName);
  hostedGamesList.appendChild(gameDiv);
  return hostedGamesList;
};

utils.closePopup = function(id) {
  document.getElementById(id).style.display = 'none';
};
