let interval;
const addListeners = function () {
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
  document.querySelector('#message').innerHTML = "Game starts";
  setTimeout(()=>{
    window.location = this.responseURL;
  },1000);
};
window.onload = addListeners;
