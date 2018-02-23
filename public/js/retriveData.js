const areEqual=function(first,second){
  for (let index = 0; index < first.length; index++) {
    if(first[index]!=second[index]){
      return false;
    }
  }
  return first.length==second.length;
};

const includes=function(array,item){
  return array.some((element)=>{
    return areEqual(element,item);
  });
};

const displayHead=function(head,damagedPositions){
  let headCell=document.getElementById(generateCellId('og',head));
  if(!includes(damagedPositions,head)){
    headCell.style.backgroundImage = "url('../assets/images/head.png')";
  }else{
    headCell.style.backgroundImage = "url('../assets/images/headHit.png')";
  }
};

const displayTail=function(tail,damagedPositions){
  let tailCell=document.getElementById(generateCellId('og',tail));
  if(!includes(damagedPositions,tail)){
    tailCell.style.backgroundImage = "url('../assets/images/tail.png')";
  }else{
    tailCell.style.backgroundImage = "url('../assets/images/tailHit.png')";
  }
};

const displayBody=function(shipCoords,damagedPositions){
  for (let index = 1; index < shipCoords.length-1; index++) {
    let generatedCell = generateCellId('og',shipCoords[index]);
    let bodyCell=document.getElementById(generatedCell);
    if(!includes(damagedPositions,shipCoords[index])){
      bodyCell.style.backgroundImage = "url('../assets/images/body.png')";
    }else{
      bodyCell.style.backgroundImage = "url('../assets/images/bodyHit.png')";
    }
  }
};

const displayShip = function(ship){
  let shipCoords = getCoordinates(ship.direction,ship.initialPos,ship.length);
  let head = shipCoords[0];
  let tail = shipCoords[shipCoords.length-1];
  let damagedPositions = ship.posOfDamage;
  displayHead(head,damagedPositions);
  displayTail(tail,damagedPositions);
  displayBody(shipCoords,damagedPositions);
};

const updateDisplay = function(){
  let fleet = JSON.parse(this.responseText).fleet;
  if(fleet.length!=0){
    document.getElementsByClassName('shipsBlock')[0].style.display='none';
    document.getElementsByClassName('buttonBlock')[0].style.display='none';
    utils.poll(utils.get(),'/arePlayersReady',handleStartGame);
  }
  fleet.map(displayShip);
};

const getAndUpdateGameStatus = function(){
  sendJsonData(utils.get(),'/gameStatus',updateDisplay);
};
