const getHostedGames = function () {
  utils.sendAjax(utils.get(),'/getHostedGames',showHostedGames);
};

const getAudioStatus = function(){
  document.querySelector('#loader-wrapper').style.display = 'none';
  utils.sendAjax(utils.get(),'/audioStatus',controlAudio);
};

const handleOnload = function(){
  getAudioStatus();
  getHostedGames();
};
const joinGame = function(){
  let gameId = event.target.id;
  let name = document.querySelector('#username2').value;
  if(name){
    let userDetails = utils.toS({username:name,gameId:gameId});
    utils.sendAjax(utils.post(),'/join',startgameMessage,userDetails);
  }
  return;
};

const startgameMessage = function(){
  location.href = "game.html";
};

const openJoinBlock = function () {
  let gameId = event.target.id;
  let joinForm = document.querySelector('.joinForm');
  joinForm.id = gameId;
  document.getElementById('joinBlock').style.display='block';
};

const showHostedGames = function () {
  let hostedGames = utils.getResponse(this);
  let hostedGamesTable = utils.getHostedGamesTable();
  hostedGamesTable.innerHTML = '';
  hostedGames.reduce(utils.appendGameInTable,hostedGamesTable);
  setTimeout(getHostedGames,2000);
};

const controlAudio = function(){
  let backgroundMusic = document.querySelector('#bgm');
  let response = utils.getResponse(this);

  response.music = utils.parse(response.music);
  backgroundMusic.play();
  backgroundMusic.muted = !response.music;
};

window.onload = handleOnload;
