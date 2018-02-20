const createGetRequest = function(url,listener) {
  let xml = new XMLHttpRequest();
  xml.addEventListener("load",listener);
  xml.open('GET',url);
  xml.send();
};

const afterCancel = function(){
  document.querySelector(".popup").style.display = "none";
  clearInterval(interval);
};

const cancelGame = function(){
  let url = '/cancel-game';
  sendReq('GET',url,afterCancel);
};

const createGame = function(){
  addListeners();
  let url = '/create-game';
  sendReq('GET',url,showOpponentArrival);
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
