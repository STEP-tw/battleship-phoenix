const aboutGameAction = function (){
  document.getElementById('aboutGame').style.display='block';
};
const settingsAction = function (){
  document.getElementById('settings').style.display='block';
};
const cancelSettingsAction = function (){
  document.getElementById('settings').style.display='none';
};
const joinButtonAction = function (){
  location.href = '/hostedGames.html';
};
const hostButtonAction = function (){
  document.getElementById('login').style.display='block';
};
const hostOrJoin = function(){
  document.getElementById('playnow').style.display='block';
};

const addOnclickListeners = function (){
  document.getElementById('aboutGameButton').onclick=aboutGameAction;
  document.getElementById('playnowButton').onclick=hostOrJoin;
  document.getElementById('settingsButton').onclick=settingsAction;
  document.getElementById('cancel').onclick=cancelGame;
  document.querySelector('.joinButton').onclick=joinButtonAction;
  document.querySelector('.hostButton').onclick=hostButtonAction;
  document.getElementById('music').onclick=bgmController;
  document.getElementById('cancelSettings').onclick=cancelSettingsAction;
  document.getElementById('cancelSettings').onclick=cancelSettingsAction;
  document.querySelector('#loader-wrapper').style.display = 'none';
};

window.onload = addOnclickListeners;
