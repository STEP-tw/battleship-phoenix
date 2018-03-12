let utils = {};
let intervals = [];

utils.get = function() {
  return 'GET';
};

utils.post = function() {
  return 'POST';
};
utils.parse = function(text){
  return JSON.parse(text);
};

utils.getResponse = function(xhr) {
  return utils.parse(xhr.responseText);
};

utils.toS = function(content) {
  return JSON.stringify(content);
};

utils.updateMessage = function(content) {
  utils.getMessageBox().innerHTML = content;
};

utils.getTargetGrid = function() {
  return document.querySelector('#targetGrid');
};

utils.getOceanGrid = function() {
  return document.querySelector('#oceanGrid');
};

utils.getReadyButton = function() {
  return document.querySelector('#ready');
};

utils.getPopupBox = function() {
  return document.querySelector(".popup");
};

utils.getMessageBox = function() {
  return document.querySelector('.messageBox');
};

utils.setInterval = function(callback, time = 1000) {
  let interval = setInterval(callback, time);
  intervals.push(interval);
};

utils.poll = function(method, reqUrl, callBackFunction, time = 1000) {
  utils.setInterval(() => {
    utils.sendAjax(method, reqUrl, callBackFunction);
  }, time);
};

utils.clearIntervals = function() {
  intervals.forEach(function(interval) {
    clearInterval(interval);
  });
};

utils.clearLastInterval = function() {
  clearInterval(intervals.pop());
};

utils.getHostedGamesTable = function() {
  return document.querySelector('.hostedTable');
};

utils.createButton = function(name) {
  let button = document.createElement('button');
  button.innerText = name;
  return button;
};

utils.createList = function(name) {
  let list = document.createElement('li');
  list.innerText = name;
  return list;
};

utils.createDiv = function(id) {
  let div = document.createElement('div');
  div.id = id;
  return div;
};

utils.sendAjax = function(method, url, callback, data = "{}") {
  let req = new XMLHttpRequest();
  req.open(method, url);
  req.setRequestHeader('Content-Type', 'application/json');
  req.onload = callback;
  req.send(data);
};

utils.setBackgroundColor=function(rows,columnForGame){
  if (rows%2 == 1) {
    columnForGame.style.backgroundColor = "rgba(43, 63, 80, 0.58)";

  }else {
    columnForGame.style.backgroundColor = "rgba(1,1,1,0.4)";
  }
};

utils.getColumnForGameName = function(gameName,gameId,onclickFun) {
  let columnForGameName = document.createElement('td');
  columnForGameName.innerHTML = `${gameName}'s game`;
  columnForGameName.className = "hostedGame";
  columnForGameName.id = gameId;
  columnForGameName.onclick = onclickFun;
  return columnForGameName;
};

utils.appendGameInTable = function(hostedGamesTable, game) {
  let rowsCount = hostedGamesTable.getElementsByTagName("tr").length;
  let gameRow = document.createElement('tr');
  let host = game.hostName;
  let id = game.gameId;
  let columnForGameName = utils.getColumnForGameName(host,id,openJoinBlock);
  utils.setBackgroundColor(rowsCount,columnForGameName);
  gameRow.appendChild(columnForGameName);
  hostedGamesTable.appendChild(gameRow);
  return hostedGamesTable;
};

utils.closePopup = function(id) {
  document.getElementById(id).style.display = 'none';
};

utils.areEqual = function(firstList, secondList) {
  for (let index = 0; index < firstList.length; index++) {
    if (firstList[index] != secondList[index]) {
      return false;
    }
  }
  return firstList.length == secondList.length;
};
