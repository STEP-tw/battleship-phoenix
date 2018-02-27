const bgmController = function() {
  let musicElement = document.getElementById('bgm');
  musicElement.muted = !musicElement.muted;
  let listItemColor = document.getElementById('music').style;
  if (listItemColor.backgroundColor=="grey") {
    listItemColor.backgroundColor = "rgba(0, 0, 0, 0.85)";
  }else {
    listItemColor.backgroundColor = "grey";
  }
};

function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage :'en'},'translater');
}
