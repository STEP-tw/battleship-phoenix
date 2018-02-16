let interval;
const showArrival = function () {
  setTimeout(()=>{
    interval = setInterval(askHasOpponentJoined,1000);
  },500);
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
  xml.send();
};

const askHasOpponentJoined = function() {
  createGetRequest('/hasOpponentJoined',showOpponentArrival);
};


const startGameRequest = function() {
  createGetRequest('/start-game',()=>{
    document.querySelector('#message').innerHTML = "Game started !!!";
  });
};
window.onload = showArrival;
