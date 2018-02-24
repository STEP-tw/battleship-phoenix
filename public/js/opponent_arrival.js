const afterCancel = function(){
  document.querySelector(".popup").style.display = "none";
  utils.clearIntervals();
};

const cancelGame = function(){
  let url = '/cancel-game';
  sendAjax(utils.get(),url,afterCancel);
};

const startGame = function(){
  if(this.responseText){
    let messageBox = document.querySelector('.messageBox');
    messageBox.innerHTML = 'Game Starts';
  }
};

const canStartGame = function(){
  let url = '/start-game';
  sendAjax(utils.get(),url,startGame);
};

const sendAjax = function(method,url,callback,data) {
  let req = new XMLHttpRequest();
  req.open(method,url);
  req.setRequestHeader('Content-Type','application/json');
  req.onload = callback;
  req.send(data||"{}");
};

const getShipPartUrl = function(url){
  if(url.includes('head.')){
    url = url.replace('head','headHit');
  } else if (url.includes('tail.')) {
    url = url.replace('tail','tailHit');
  } else if(url.includes('body.')){
    url = url.replace('body','bodyHit');
  }
  return url;
};
