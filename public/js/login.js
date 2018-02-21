let interval;
const showMessage = function(){
  document.getElementById('login').style.display='none';
  document.getElementById('playnow').style.display='none';
  document.getElementsByClassName('popup')[0].style.display = "block";
};
const hostGame = function(){
  let name = document.querySelector('#username1').value;
  let userDetails = `username=${name}`;
  sendReq('post','/login',showMessage,userDetails);
  askForOpponent();
};

const startgameMessage = function(){
  location.href = "game.html";
};

const joinGame = function(){
  let name = document.querySelector('#username2').value;
  let userDetails = `username=${name}`;
  sendReq('post','/login',startgameMessage,userDetails);
};

const askForOpponent = function () {
  interval = setInterval(askHasOpponentJoined,1000);
};

const startGameReq = function(){
  location.href = "game.html";
};


const showOpponentArrival = function() {
  let response = JSON.parse(this.responseText);
  document.querySelector(".popup").style.display = "block";
  let arrivalMessage = document.querySelector('#message');
  if (response.status) {
    arrivalMessage.innerHTML = "Opponent Arrived !!!";
    clearInterval(interval);
    setTimeout(startGameReq,1000);
    return;
  }
};
const askHasOpponentJoined = function() {
  sendReq('get','/hasOpponentJoined',showOpponentArrival);
};
