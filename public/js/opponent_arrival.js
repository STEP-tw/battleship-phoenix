const afterCancel = function(){
  document.querySelector(".popup").style.display = "none";
  utils.clearIntervals();
};

const cancelGame = function(){
  let url = '/cancel-game';
  sendReq(util.get(),url,afterCancel);
};

const startGame = function(){
  if(this.responseText){
    let messageBox = document.querySelector('.messageBox');
    messageBox.innerHTML = 'Game Starts';
  }
};

const canStartGame = function(){
  let url = '/start-game';
  sendReq(utils.get(),url,startGame);
};

const sendReq = function(method,url,callback,data) {
  let req = new XMLHttpRequest();
  req.open(method,url);
  if(data) {
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  }
  req.onload = callback;
  req.send(data||'');
};

const sendJsonData = function(method,url,callback,data) {
  let req = new XMLHttpRequest();
  req.open(method,url);
  req.setRequestHeader('Content-Type','application/json');
  req.onload = callback;
  req.send(data||'');
};
