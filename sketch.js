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


// number of treasure chests found
const treasureCounter = 0;

function getRandomPosition() {
    let randomX = Math.floor(Math.random() * 10) * 30;
    let randomY = Math.floor(Math.random() * 10) * 30;

    return [randomX, randomY];
}

function createTreasure() {
    for (let index = 0; index < 10; index++) {
        let [randomX, randomY] = getRandomPosition();
        treasures.push([randomX, randomY]);
    }
}

function setup() {
    createCanvas(300, 300);
    let [randomX, randomY] = getRandomPosition();
    userPositionX = randomX;
    userPositionY = randomY;

    //treasures
    createTreasure();
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
            }
            rect(height, width, 30, 30);
        }
    }
}

function updateTreasureCounter() {
    document.querySelector('#treasureCounter').innerHTML = `Treasure Counter: ${numTreasureChests - treasures.length}`;
}

function isTreasure(x, y) {
    const foundIndex = treasures.findIndex(coordinates => coordinates[0] == x && coordinates[1] == y);
    return foundIndex > -1;
}

function removeTreasure(x, y) {
    const foundIndex = treasures.findIndex(coordinates => coordinates[0] == x && coordinates[1] == y);
    treasures.splice(foundIndex, 1);
}

function isWithinBoundary(value) {
    return value >= 0 && value <= 270;
}

function keyPressed() {
    if (keyCode == UP_KEY) {
        if (isWithinBoundary(userPositionX - 30)) {
            userPositionX = userPositionX - 30;
        }
    } else if (keyCode == RIGHT_KEY) {
        if (isWithinBoundary(userPositionY + 30)) {
            userPositionY = userPositionY + 30;
        }
    } else if (keyCode == DOWN_KEY) {
        if (isWithinBoundary(userPositionX + 30)) {
            userPositionX = userPositionX + 30;
        }
    } else if (keyCode == LEFT_KEY) {
        if (isWithinBoundary(userPositionY - 30)) {
            userPositionY = userPositionY - 30;
        }
    }

}