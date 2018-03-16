const aboutGameAction = function (){
  document.querySelector('#aboutGame').style.display='block';
};
const settingsAction = function (){
  document.querySelector('#settings').style.display='block';
};
const cancelSettingsAction = function (){
  document.querySelector('#settings').style.display='none';
};
const joinButtonAction = function (){
  location.href = '/hostedGames.html';
};
const hostButtonAction = function (){
  document.querySelector('#login').style.display='block';
};

const hostOrJoin = function(){
  document.querySelector('#playnow').style.display='block';
};

const gameTypeAction = function(){
  let isClassicGame = !document.querySelector('#dn').checked;
  document.cookie = `isClassicGame=${isClassicGame}`;
};

const controlAudio = function(){
  let musicButton = document.querySelector('#music');
  let soundButton = document.querySelector('#sound');
  let backgroundMusic = document.querySelector('#bgm');
  let response = utils.getResponse(this);

  response.music = utils.parse(response.music);
  response.sound = utils.parse(response.sound);
  musicButton.checked = response.music;
  soundButton.checked = response.sound;
  backgroundMusic.play();
  backgroundMusic.muted = !response.music;
};

const addOnclickListeners = function (){
  document.querySelector('#dn').onclick = gameTypeAction;
  document.querySelector('#aboutGameButton').onclick = aboutGameAction;
  document.querySelector('#playnowButton').onclick = hostOrJoin;
  document.querySelector('#settingsButton').onclick = settingsAction;
  document.querySelector('#cancel').onclick = cancelGame;
  document.querySelector('.joinButton').onclick = joinButtonAction;
  document.querySelector('.hostButton').onclick = hostButtonAction;
  document.querySelector('#music').onclick = bgmController;
  document.querySelector('#sound').onclick = soundController;
  document.querySelector('#cancelSettings').onclick = cancelSettingsAction;
  document.querySelector('#cancelSettings').onclick = cancelSettingsAction;
  document.querySelector('#loader-wrapper').style.display = 'none';
};

const activateOptions = function(){
  utils.sendAjax(utils.get(),'/audioStatus',controlAudio);
  addOnclickListeners();
};

window.onload = activateOptions;
