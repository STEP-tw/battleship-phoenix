let interval;
const addListeners = function () {
  interval = setInterval(askHasOpponentJoined,1000);
};

const showOpponentArrival = function() {
  document.querySelector(".popup").style.display = "block";
  let arrivalMessage = document.querySelector('#message');
  if (this.responseText=="true") {
    arrivalMessage.innerHTML = "Opponent Arrived";
    clearInterval(interval);
    startGameRequest();
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
  let oreq = createGetRequest('/hasOpponentJoined',showOpponentArrival);
  oreq.send();
};

const redirectOnStart = function() {
  var myHeader = this.getResponseHeader('location');
  if(!myHeader){
    document.querySelector('#message').innerHTML = "Game started !!!";
    setTimeout(()=>window.location='/',1000);
  }
};

const startGameRequest = function() {
  let oreq = createGetRequest('/start-game',redirectOnStart);
  oreq.setRequestHeader('location',undefined);
  oreq.send();
  createGetRequest('/start-game',redirectOnStart);
};

window.onload = addListeners;
