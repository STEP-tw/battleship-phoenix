let interval;

const afterCancel = function(){
  window.location.href = '/';
};

const cancelGame = function(){
  let url = '/cancel-game';
  createGetRequest(url,afterCancel);
};

const addListeners = function () {
  let cancelButton = document.getElementById('cancel');
  cancelButton.onclick = cancelGame;
  let askHasOpponentJoined =
    createGetRequest('/hasOpponentJoined',showOpponentArrival);
  interval = setInterval(askHasOpponentJoined,1000);
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

const changeLocation = function(){
  setTimeout(()=>{
    window.location = this.responseURL;
  },1000);
};


window.onload = addListeners;
