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

// traps
const trapThreshold = 3;
const traps = [];
const triggeredTraps = [];

// obstacles
const obstacles = [];

let showTreasureAlert = true;

// number of treasure chests found
const treasureCounter = 0;
const positionsTaken = [];

// timer counter
let timerCounter = 120; // time in seconds
let timer;
let startTimer = false;

// game status
let status = "running";

// sprites
let player;
let stone;
let treasure;
let trap;
let trap_triggered;


// fog-of-war
let activateFog = true;
let exceptions;

function preload() {
    player = loadImage('assets/player.png');
    stone = loadImage('assets/stone.png');
    treasure = loadImage('assets/treasure.png');
    trap = loadImage('assets/trap.png');
    trap_triggered = loadImage('assets/trap_triggered.png');
}

function updateTimer() {
    if (timerCounter == 0 && status == 'running') {
        clearInterval(timer);
        alert("You lost");
    } else {
        document.querySelector('#timerCounter').innerHTML = `${--timerCounter} seconds`;
    }
}

function updateTriggeredTrapsCounter() {
    document.querySelector('#triggeredTraps').textContent = `Traps triggered: ${triggeredTraps.length}`;
}

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

function createTraps() {
    let numTraps = Math.floor(Math.random() * 5) + 3;
    for (let index = 0; index < numTraps; index++) {
        traps.push(getRandomPosition());
    }
}

function setup() {
    createCanvas(300, 300);
    let [randomX, randomY] = getRandomPosition();
    userPositionX = randomX;
    userPositionY = randomY;

    //treasures
    createTreasure();

    // obstacles
    createObstacles();

    //traps
    createTraps();

    timer = setInterval(updateTimer, 1000);
}

function draw() {
    exceptions = [
        [userPositionY, userPositionX],
        [userPositionY + 30, userPositionX],
        [userPositionY + 60, userPositionX],
        [userPositionY, userPositionX + 30],
        [userPositionY, userPositionX + 60],
        [userPositionY - 30, userPositionX],
        [userPositionY - 60, userPositionX],
        [userPositionY, userPositionX - 30],
        [userPositionY, userPositionX - 60],
    ].filter(([exceptionY, exceptionX]) => isWithinBoundary(exceptionY) && isWithinBoundary(exceptionX));

    if (status == 'running') {
        updateTreasureCounter();
        checkTriggeredTrap();
        updateTriggeredTrapsCounter();
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                stroke(0);
                fill(255);

                let height = y * 30;
                let width = x * 30;
                rect(height, width, 30, 30);

                if (userPositionX == width && userPositionY == height) {
                    image(player, userPositionY, userPositionX, 30, 30);

                    if (isTreasure(width, height)) {
                        removeTreasure(width, height);
                    }
                } else if (isTreasure(width, height)) {
                    image(treasure, height, width, 30, 30);
                } else if (isObstacle(width, height)) {
                    image(stone, height, width, 30, 30);
                } else if (isTrap(width, height)) {
                    image(trap, height, width, 30, 30);
                }
                if (isTriggeredTrap(width, height)) {
                    image(trap_triggered, height, width, 30, 30);
                }

                if (!isException(height, width)) {
                    fill(51);
                    rect(height, width, 30, 30);
                }
            }
        }
    }
}

function updateTreasureCounter() {
    document.querySelector('#treasureCounter').innerHTML = `Treasure Counter: ${numTreasureChests - treasures.length}`;
    if (treasures.length == 0 && showTreasureAlert) {
        showTreasureAlert = false;
        status == 'won';
        clearInterval(timer);
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

function isTrap(x, y) {
    return isRelated(x, y, traps);
}

function isTriggeredTrap(x, y) {
    return isRelated(x, y, triggeredTraps);
}

function isException(x, y) {
    return isRelated(x, y, exceptions);
}

function checkTriggeredTrap() {
    if (trapThreshold == triggeredTraps.length) {
        alert('You lose!');
        status = 'lose';
    }
}

function removeTreasure(x, y) {
    const foundIndex = treasures.findIndex(coordinates => coordinates[0] == x && coordinates[1] == y);
    treasures.splice(foundIndex, 1);
}

function removeTrap(x, y) {
    const foundIndex = traps.findIndex(coordinates => coordinates[0] == x && coordinates[1] == y);
    traps.splice(foundIndex, 1);
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

    if (isTrap(userPositionX, userPositionY)) {
        triggeredTraps.push([userPositionX, userPositionY]);
        removeTrap(userPositionX, userPositionY);
    }
}