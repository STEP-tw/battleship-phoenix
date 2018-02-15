let interval;
const addClickListener = function () {
  let readyButton = document.querySelector('#ready');
  readyButton.onclick = ()=>{
    interval = setInterval(askHasOpponentJoined,1000);
  };
};

const showOpponentArrival = function() {
  document.querySelector(".popup").style.display = "block";
  let arrivalMessage = document.querySelector('#message');
  if (this.responseText=="true") {
    arrivalMessage.innerHTML = "Opponent Arrived";
    clearInterval(interval);
    return;
  }
  arrivalMessage.innerHTML = "Waiting For Opponent";
};

const askHasOpponentJoined = function() {
  let xml = new XMLHttpRequest();
  xml.addEventListener("load",displayOpponentArrival);
  xml.open('GET','/hasOpponentPlayer');
  xml.send();
};


window.onload = addClickListener;
