let interval;
const showArrival = function () {
  setTimeout(()=>{
    interval = setInterval(askHasOpponentJoined,1000);
  },1000);
};

const showOpponentArrival = function() {
  document.querySelector(".popup").style.display = "block";
  let arrivalMessage = document.querySelector('#message');
  if (this.responseText=="true") {
    arrivalMessage.innerHTML = "Opponent Arrived";
    clearInterval(interval);
    return;
  }
  arrivalMessage.innerHTML = "Hello! player 1.....Waiting For Opponent";
};

const askHasOpponentJoined = function() {
  let xml = new XMLHttpRequest();
  xml.addEventListener("load",showOpponentArrival);
  xml.open('GET','/hasOpponentJoined');
  xml.send();
};

window.onload = showArrival;
