const changeDirection = function (direction) {
  let nextDir = {
    south: "west",
    west: "north",
    north: "east",
    east: "south"
  };
  return nextDir[direction];
};

const isBetweenZeroAndTen = function (number) {
  return number >= 0 && number < 10;
};

const validateShipAllPos = function (coord) {
  return isBetweenZeroAndTen(coord[0]) &&
    isBetweenZeroAndTen(coord[1]);
};

const isShipCell = function (position, listOfPos) {
  return listOfPos.some((pos) => {
    return position[0] == pos[0] && position[1] == pos[1];
  });
};

const getShipByCellPos = function (coord) {
  let ship = shipsHeadPositions.filter((ship) => {
    let shipCoords = getCoordinates(ship.dir, ship.headPos, ship.length);
    return isShipCell(coord, shipCoords);
  })[0];
  return ship;
};

const rotateShip = function (event) {
  let coord = parseCoordinates(event.target.id);
  let ship = getShipByCellPos(coord);
  if (!ship) {
    return;
  }
  let oldshipCoords = getCoordinates(ship.dir, ship.headPos, ship.length);
  let dir = changeDirection(ship.dir);
  let newShipCoords = getCoordinates(dir, ship.headPos, ship.length);
  let isValidCoord = validateShipAllPos(newShipCoords[ship.length - 1]);
  let hasAnyCellOccupyShip = newShipCoords.filter(getShipByCellPos);
  if (!isValidCoord || hasAnyCellOccupyShip.length > 1) {
    return;
  }
  removeShip(oldshipCoords);
  ship.dir = dir;
  drawRotatedShip(newShipCoords, ship.dir);
};

const removeShip = function (shipCoords) {
  shipCoords.forEach((coord) => {
    let cellId = document.getElementById(generateCellId("og", coord));
    cellId.style.backgroundImage = null;
    cellId.checked = false;
  });
};


const getShipImageByDir = function (direction) {
  let shipImages = {
    west: {
      head: "head_rotated.png",
      tail: "tail_rotated.png",
      body: "body_rotated.png"
    },
    south: {
      head: "head.png",
      tail: "tail.png",
      body: "body.png"
    },
    north: {
      head: "tail.png",
      tail: "head.png",
      body: "body.png"
    },
    east: {
      head: "tail_rotated.png",
      tail: "head_rotated.png",
      body: "body_rotated.png"
    },
  };
  return shipImages[direction];
};

const drawRotatedShip = function (cellIdList, dir) {
  cellIdList = cellIdList.map((cellId)=>{
    return generateCellId('og',cellId);
  });
  let shipImages = getShipImageByDir(dir);
  let headCell = document.getElementById(cellIdList[0]);
  headCell.style.backgroundImage = `url('../assets/images/${shipImages.head}')`;

  let tailCell = document.getElementById(cellIdList[cellIdList.length - 1]);
  tailCell.style.backgroundImage = `url('../assets/images/${shipImages.tail}')`;

  for (let iter = 1; iter < cellIdList.length - 1; iter++) {
    let cell = document.getElementById(cellIdList[iter]);
    cell.style.backgroundImage = `url('../assets/images/${shipImages.body}')`;
  }
};
