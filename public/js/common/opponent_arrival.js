const afterCancel = function(){
  utils.getPopupBox().style.display = "none";
  utils.clearIntervals();
};

const cancelGame = function(){
  let url = '/cancel-game';
  utils.sendAjax(utils.get(),url,afterCancel);
};

const startGame = function(){
  if(this.responseText){
    let messageBox = utils.getMessageBox();
    messageBox.innerHTML = 'Game Starts';
  }
};

const canStartGame = function(){
  let url = '/start-game';
  utils.sendAjax(utils.get(),url,startGame);
};

const getShipPartUrl = function(type,url){
  if(!url.includes('hit.png')&& type == 'hits'){
    url = url.replace('.png',`_hit.png`);
  }
  if(type=='misses'){
    url = "url('../assets/images/miss.png')";
  }
  return url;
};
