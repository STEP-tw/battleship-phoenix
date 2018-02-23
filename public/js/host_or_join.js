const disableButton = function(id){
  let button = document.getElementById(id);
  button.onclick=null;
  button.style.backgroundColor = 'rgb(130, 135, 130)';
  button.style.color = 'rgb(218, 219, 219)';
};

const showHostOrJoin = function(){
  let response = utils.parse(this.responseText);
  if(!('areTwoPlayers' in response)){
    disableButton('joinButton');
    return;
  }if(!response['areTwoPlayers']){
    disableButton('hostButton');
    return;
  }
  disableButton('hostButton');
  disableButton('joinButton');
};

const hostOrJoin = function(){
  document.getElementById('playnow').style.display='block';
  let url = '/host_or_join';
  sendReq(utils.get(),url,showHostOrJoin);
};
