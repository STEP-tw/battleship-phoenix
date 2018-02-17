let interval;

const afterCancel = function(){
  window.location.href = '/';
};

const cancelGame = function(){
  let url = '/cancel-game';
  let onReq = createGetRequest(url,afterCancel);
  onReq.send();
};

const addListeners = function () {
  let cancelButton = document.getElementById('cancel');
  cancelButton.onclick = cancelGame;
  interval = setInterval(askHasOpponentJoined,1000);
};

const showOpponentArrival = function() {
  document.querySelector(".popup").style.display = "block";
  let arrivalMessage = document.querySelector('#message');
  if (this.responseText=="true") {
    arrivalMessage.innerHTML = "Opponent Arrived";
    clearInterval(interval);
    return;
  }
  arrivalMessage.innerHTML = "Hello! player 1.....Waiting For Opponent";
};

const createGetRequest = function(url,listener) {
  let xml = new XMLHttpRequest();
  xml.addEventListener("load",listener);
  xml.open('GET',url);
  return xml;
};

const askHasOpponentJoined = function() {
  let onReq = createGetRequest('/hasOpponentJoined',showOpponentArrival);
  onReq.send();
};

const redirectOnStart = function() {
  let myHeader = this.getResponseHeader('location');
  if(!myHeader){
    document.querySelector('#message').innerHTML = "Game started !!!";
    setTimeout(()=>{
      window.location='/';
    },1000);
  }
};

const startGameRequest = function() {
  let onReq = createGetRequest('/start-game',redirectOnStart);
  onReq.setRequestHeader('location',undefined);
  onReq.send();
};

window.onload = addListeners;
