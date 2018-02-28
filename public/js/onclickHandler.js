const aboutGameAction = function (){
  document.getElementById('aboutGame').style.display='block';
};

const aboutUsAction = function (){
  document.getElementById('aboutUs').style.display='block';
};

const settingsAction = function (){
  document.getElementById('settings').style.display='block';
};
const cancelSettingsAction = function (){
  document.getElementById('settings').style.display='none';
};
const joinButtonAction = function (){
  document.getElementById('join').style.display='block';
};
const hostButtonAction = function (){
  document.getElementById('login').style.display='block';
};

const addOnclickListeners = function (){
  document.getElementById('aboutGameButton').onclick=aboutGameAction;
  document.getElementById('aboutUsButton').onclick=aboutUsAction;
  document.getElementById('playnowButton').onclick=hostOrJoin;
  document.getElementById('settingsButton').onclick=settingsAction;
  document.getElementById('cancel').onclick=cancelGame;
  document.querySelector('.submitOnJoin').onclick=joinGame;
  document.querySelector('.submitOnHost').onclick=hostGame;
  document.querySelector('.joinButton').onclick=joinButtonAction;
  document.querySelector('.hostButton').onclick=hostButtonAction;
  document.getElementById('music').onclick=bgmController;
  document.getElementById('cancelSettings').onclick=cancelSettingsAction;
};

window.onload = addOnclickListeners;
