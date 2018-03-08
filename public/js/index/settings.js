const bgmController = function(event) {
  let musicButton = document.querySelector(`#${event.target.id}`);
  let buttonData = utils.toS({"music":musicButton.checked});
  utils.sendAjax(utils.post(),'/controlMusic',toggleMusic,buttonData);
};

const toggleMusic = function (){
  let response = utils.getResponse(this);
  let musicElement = document.getElementById('bgm');
  musicElement.muted = !response.music;
};

const soundController = function(){
  let soundButton = document.querySelector(`#${event.target.id}`);
  let buttonData = utils.toS({sound:soundButton.checked});
  utils.sendAjax(utils.post(),'/controlSound',null,buttonData);
};

function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage :'en'},'translater');
}
