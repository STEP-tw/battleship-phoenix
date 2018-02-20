let interval;
const afterCancel = function(){
  document.querySelector(".popup").style.display = "none";
  clearInterval(interval);
};

const cancelGame = function(){
  let url = '/cancel-game';
  sendReq('GET',url,afterCancel);
};

const addListeners = function () {
  let cancelButton = document.getElementById('cancel');
  cancelButton.onclick = cancelGame;
  let askHasOpponentJoined =
    createGetRequest('/hasOpponentJoined',showOpponentArrival);
  interval = setInterval(askHasOpponentJoined,1000);
};

const showTurnsMessage = function(){
  let playerName = this.responseText;
  let messageBox = document.getElementsByClassName('messageBox')[0];
  messageBox.innerHTML = `${playerName}'s turn`;
};

const createGame = function(){
  addListeners();
  let url = '/create-game';
  sendReq('GET',url,showOpponentArrival);
};

const showOpponentArrival = function() {
  document.querySelector(".popup").style.display = "block";
  let arrivalMessage = document.querySelector('#message');
  if (this.responseText=="true") {
    arrivalMessage.innerHTML = "Opponent Arrived !!!";
    clearInterval(interval);
    setTimeout(createGetRequest('/start-game',changeLocation),1000);
    return;
  }
  arrivalMessage.innerHTML = "Hello! player 1.....Waiting For Opponent";
};

const createGetRequest = function(url,listener) {
  return ()=>{
    let xml = new XMLHttpRequest();
    xml.addEventListener("load",listener);
    xml.open('GET',url);
    xml.send();
  };
};


const sendReq = function(method,url,callback,data) {
  let req = new XMLHttpRequest();
  req.open(method,url);
  if(data) {
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  }
  req.onload = callback;
  req.send(data);
};
