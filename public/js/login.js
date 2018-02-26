const showMessage = function(){
  document.getElementById('login').style.display='none';
  document.getElementById('playnow').style.display='none';
  document.getElementsByClassName('popup')[0].style.display = "block";
};
const hostGame = function(){
  let name = document.querySelector('#username1').value;
  if(name){
    let userDetails = JSON.stringify({username:name});
    sendAjax('post','/login',showMessage,userDetails);
    askForOpponent();
  }
  return;
};

const startgameMessage = function(){
  location.href = "game.html";
};

const joinGame = function(){
  let name = document.querySelector('#username2').value;
  if(name){
    let userDetails = JSON.stringify({username:name});
    sendAjax(utils.post(),'/login',startgameMessage,userDetails);
  }
  return;
};

const askForOpponent = function () {
  utils.poll(utils.get(),'hasOpponentJoined',showOpponentArrival);
};

const startGameReq = function(){
  location.href = "game.html";
};


const showOpponentArrival = function() {
  let response = utils.parse(this.responseText);
  document.querySelector(".popup").style.display = "block";
  let arrivalMessage = document.querySelector('#message');
  if (response.status) {
    arrivalMessage.innerHTML = "Opponent Arrived !!!";
    utils.clearIntervals();
    setTimeout(startGameReq,1000);
    return;
  }
};
