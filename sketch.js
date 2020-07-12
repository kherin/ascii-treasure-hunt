const rows = 10;
const columns = 10;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
const LEFT_KEY = 37;

let userPositionX = 0;
let userPositionY = 0;

const numTreasureChests = 10;
const treasures = [];

// obstacles
const obstacles = [];

let showTreasureAlert = true;

// number of treasure chests found
const treasureCounter = 0;
const positionsTaken = [];

function getRandomPosition() {

    let randomX = 0;
    let randomY = 0;

    while (true) {
        randomX = Math.floor(Math.random() * 10) * 30;
        randomY = Math.floor(Math.random() * 10) * 30;

        if (positionsTaken.length) {
            let positionTakenIndex = positionsTaken.findIndex((position) => position[0] == randomX && position[1] == randomY);
            if (positionTakenIndex == -1) {
                positionsTaken.push([randomX, randomY])
                break;
            }
        } else {
            positionsTaken.push([randomX, randomY])
            break;
        }

    }

    return [randomX, randomY];
}

function createTreasure() {
    for (let index = 0; index < 10; index++) {
        let [randomX, randomY] = getRandomPosition();
        treasures.push([randomX, randomY]);
    }
}

function createObstacles() {
    let numObstacles = Math.floor(Math.random() * 50);
    for (let index = 0; index < numObstacles; index++) {
        obstacles.push(getRandomPosition());
    }
}

function setup() {
    createCanvas(300, 300);
    let [randomX, randomY] = getRandomPosition();
    userPositionX = randomX;
    userPositionY = randomY;

    //treasures
    createTreasure();

    //create obstacles
    createObstacles();

    console.log('treasures: ', treasures);
    console.log('obstacles: ', obstacles);
}

function draw() {
    updateTreasureCounter();
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            stroke(0);
            fill(255);

            let height = y * 30;
            let width = x * 30;
            if (userPositionX == width && userPositionY == height) {
                stroke(0);
                fill(255, 204, 0);

                if (isTreasure(width, height)) {
                    removeTreasure(width, height);
                }
            } else if (isTreasure(width, height)) {
                stroke(0);
                fill(243, 148, 40);
            } else if (isObstacle(width, height)) {
                stroke(0);
                fill(60, 60, 60);
            }
            rect(height, width, 30, 30);
        }
    }
}

function updateTreasureCounter() {
    document.querySelector('#treasureCounter').innerHTML = `Treasure Counter: ${numTreasureChests - treasures.length}`;
    if (treasures.length == 0 && showTreasureAlert) {
        showTreasureAlert = false;
        alert("You've collected all the treasures!");
    }
}

function isRelated(x, y, objects) {
    const foundIndex = objects.findIndex(coordinates => coordinates[0] == x && coordinates[1] == y);
    return foundIndex > -1;
}

function isTreasure(x, y) {
    return isRelated(x, y, treasures);
}

function isObstacle(x, y) {
    return isRelated(x, y, obstacles);
}

function removeTreasure(x, y) {
    const foundIndex = treasures.findIndex(coordinates => coordinates[0] == x && coordinates[1] == y);
    treasures.splice(foundIndex, 1);
}

function isWithinBoundary(value) {
    return value >= 0 && value <= 270;
}

function hitObstacle(x, y) {
    return isRelated(x, y, obstacles);
}

function keyPressed() {
    if (keyCode == UP_KEY) {
        let nextMove = userPositionX - 30;
        if (isWithinBoundary(nextMove) && !hitObstacle(nextMove, userPositionY)) {
            userPositionX = nextMove;
        }
    } else if (keyCode == RIGHT_KEY) {
        let nextMove = userPositionY + 30;
        if (isWithinBoundary(nextMove) && !hitObstacle(userPositionX, nextMove)) {
            userPositionY = nextMove;
        }
    } else if (keyCode == DOWN_KEY) {
        let nextMove = userPositionX + 30;
        if (isWithinBoundary(nextMove) && !hitObstacle(nextMove, userPositionY)) {
            userPositionX = nextMove;
        }
    } else if (keyCode == LEFT_KEY) {
        let nextMove = userPositionY - 30;
        if (isWithinBoundary(nextMove) && !hitObstacle(userPositionX, nextMove)) {
            userPositionY = nextMove;
        }
    }
}