const afterCancel = function(){
  document.querySelector(".popup").style.display = "none";
  utils.clearIntervals();
};

const cancelGame = function(){
  let url = '/cancel-game';
  sendAjax(utils.get(),url,afterCancel);
};

const startGame = function(){
  if(this.responseText){
    let messageBox = document.querySelector('.messageBox');
    messageBox.innerHTML = 'Game Starts';
  }
};

const canStartGame = function(){
  let url = '/start-game';
  sendAjax(utils.get(),url,startGame);
};

const sendAjax = function(method,url,callback,data) {
  let req = new XMLHttpRequest();
  req.open(method,url);
  req.setRequestHeader('Content-Type','application/json');
  req.onload = callback;
  req.send(data||"{}");
};

const getShipPartUrl = function(url){
  if(url.includes('head.')){
    url = url.replace('head','headHit');
  } else if (url.includes('tail.')) {
    url = url.replace('tail','tailHit');
  } else if(url.includes('body.')){
    url = url.replace('body','bodyHit');
  }
  return url;
};
// const updateOceanGrid = function(){
//   let opponentShots = JSON.parse(this.responseText);
//   opponentShots.shots.hits.forEach((hitCoord)=>{
//     let cellId = generateCellId('og',hitCoord);
//     let cell = document.getElementById(cellId);
//     let imageUrl = cell.style.backgroundImage;
//     cell.style.backgroundImage = getShipPartUrl(imageUrl);
//   });
//   opponentShots.shots.misses.forEach((missCoord)=>{
//     let cellId = generateCellId('og',missCoord);
//     let cell = document.getElementById(cellId);
//     cell.style.backgroundImage = "url('../assets/images/miss.png')";
//   });
// };
//
// const getOpponentShot = function(){
//   sendAjax('get','/getOpponentShots',updateOceanGrid);
// };
//
