var emoji = require('node-emoji');
var logUpdate = require('log-update');
var readlineSync = require('readline-sync');
var ora = require('ora');

// Logic assumes island is a perfect square
const LENGTH = 50;
const takenCoordinates = [];

// emojis
const palmTreeEmoji = emoji.get('palm_tree');

function buildIsland() {
    const plusEmoji = emoji.get('heavy_plus_sign');

    let island = new Array(LENGTH).fill([]);
    island[0].push(new Array(LENGTH).fill(plusEmoji));

    for (let index = 1; index < LENGTH - 1; index++) {
        island[index].push([plusEmoji, ...new Array(LENGTH - 2).fill(palmTreeEmoji), plusEmoji]);
    }

    island[LENGTH - 1].push(new Array(LENGTH).fill(plusEmoji));

    return island[0];
}

function renderIsland(island) {
    let output = '';
    for (let x = 0; x < LENGTH; x++) {
        output += `${island[x].join('')}\n`;
    }
    logUpdate(output);
}

function isNotTaken(incomingCoordinates) {
    let isNotTakenFlag = false;
    if (takenCoordinates.length) {
        let foundIndex = takenCoordinates.findIndex((coordinates) => coordinates[0] == incomingCoordinates[0] && coordinates[1] == incomingCoordinates[1]);
        isNotTakenFlag = foundIndex == -1;
    }

    return isNotTakenFlag;
}

function randomValidPosition() {
    let userPositionX = 0;
    let userPositionY = 0;

    do {
        userPositionX = Math.floor(Math.random() * LENGTH) - 1;
        userPositionY = Math.floor(Math.random() * LENGTH) - 1;
    } while (userPositionX > 0 && userPositionX < LENGTH - 2 && userPositionY > 0 && userPositionY < LENGTH - 2 && isNotTaken([userPositionX, userPositionY]));

    return [userPositionX, userPositionY];
}

function clearPreviousStep(x, y, island) {
    island[x][y] = palmTreeEmoji;
}

(function () {

    let runGame = true;
    let island = buildIsland();
    let [userPositionX, userPositionY] = randomValidPosition();

    do {
        island[userPositionX][userPositionY] = emoji.get('smile');
        renderIsland(island);

        const command = readlineSync.keyIn();
        if (command == 'q') {
            unGame = false;
            break;
        } else if (command == 'w') {
            clearPreviousStep(userPositionX, userPositionY, island)
            userPositionX -= 1;
        } else if (command == 'd') {
            clearPreviousStep(userPositionX, userPositionY, island)
            userPositionY += 1;
        } else if (command == 's') {
            clearPreviousStep(userPositionX, userPositionY, island)
            userPositionX += 1;
        } else if (command == 'a') {
            clearPreviousStep(userPositionX, userPositionY, island)
            userPositionY -= 1;
        }
    } while (runGame);

})();