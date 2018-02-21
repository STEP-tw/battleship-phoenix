const disableButton = function(id){
  let button = document.getElementById(id);
  button.onclick=null;
  button.style.color = 'lightGrey';
};

const showHostOrJoin = function(){
  let response = JSON.parse(this.responseText);
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
  sendReq('GET',url,showHostOrJoin);
};
