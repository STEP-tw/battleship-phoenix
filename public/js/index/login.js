const showMessage = function(){
  document.getElementById('login').style.display='none';
  document.getElementById('playnow').style.display='none';
  document.getElementsByClassName('popup')[0].style.display = "block";
};

const hostGame = function(){
  let name = document.querySelector('#username1').value;
  if(name){
    let userDetails = utils.toS({username:name});
    utils.sendAjax('post','/host',showMessage,userDetails);
    askForOpponent();
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
  let response = utils.getResponse(this);
  utils.getPopupBox().style.display = "block";
  let arrivalMessage = document.querySelector('#message');
  if (response.status) {
    document.getElementById('cancel').style.display = 'none';
    arrivalMessage.innerHTML = "Opponent Arrived !!!";
    utils.clearIntervals();
    setTimeout(startGameReq,1000);
  }
};
