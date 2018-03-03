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

const getShipPartUrl = function(url){
  if(url.includes('head.')){
    url = url.replace('head',`head_hit`);
  } else if (url.includes('tail.')) {
    url = url.replace('tail',`tail_hit`);
  } else if(url.includes('body.')){
    url = url.replace('body',`body_hit`);
  }else if(url.includes('head_rotated')){
    url = url.replace('head',`head_hit`);
  } else if (url.includes('tail_rotated.')) {
    url = url.replace('tail',`tail_hit`);
  } else if(url.includes('body_rotated.')){
    url = url.replace('body',`body_hit`);
  }
  return url;
};
