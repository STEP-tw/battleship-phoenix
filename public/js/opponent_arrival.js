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
    arrivalMessage.innerHTML = "Opponent Arrived !!!";
    clearInterval(interval);
    setTimeout(startGameReq,1000);
    return;
  }
  arrivalMessage.innerHTML = "Hello! player 1.....Waiting For Opponent";
};

const createGetRequest = function(url,listener) {
  let xml = new XMLHttpRequest();
  xml.addEventListener("load",listener);
  xml.open('GET',url);
  xml.send();
};

const askHasOpponentJoined = function() {
  createGetRequest('/hasOpponentJoined',showOpponentArrival);
};

const startGameReq = function(){
  createGetRequest('/start-game',changeLocation);
};

const changeLocation = function(){
  setTimeout(()=>{
    window.location = this.responseURL;
  },1000);
};


window.onload = addListeners;
