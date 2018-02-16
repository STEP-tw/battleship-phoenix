let shipSize=undefined;

const showShipScope = (size)=>{
  shipSize = size;
  addMouseEvent();
};

const addMouseEvent=function(){
  let table=document.getElementById('oceanGrid');
  table.onmouseover=showOccupiedPosition;
  table.onmouseout=removeHighlight;
};

const showOccupiedPosition = function(event){
  if((event.target.id).startsWith('og')){
    let coords = positionSystem['south'](event.target.id,shipSize);
    let cellIdList=coords.map(generateCellId);

    cellIdList.forEach((cellId)=>{
      let cell=document.getElementById(cellId);
      cell.style["background-color"]="grey";
      cell.style.cursor="move";
    });
  }
};

const removeHighlight = function(event){
  if((event.target.id).startsWith('og')){
    let coords = positionSystem['south'](event.target.id,shipSize);
    let cellIdList=coords.map(generateCellId);

    cellIdList.forEach((cellId)=>{
      document.getElementById(cellId).style["background-color"]="white";
    });
  }
};

const generateCellId = function (coordinates){
  let cellId=`og_${coordinates[0]}_${coordinates[1]}`;
  return cellId;
};
