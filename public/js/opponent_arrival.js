const afterCancel = function(){
  document.querySelector(".popup").style.display = "none";
  clearInterval(interval);
};

const cancelGame = function(){
  let url = '/cancel-game';
  sendReq('GET',url,afterCancel);
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
