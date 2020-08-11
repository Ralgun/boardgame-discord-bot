
//Dependencies
const emitter = require('../event-emitter').emitter;

const gameMap = new Map();

//PLACEHOLDER
const game = require('../games/connect-four');

emitter.on('create-game', (channel, player1, player2, container) => {
    if (gameMap.get(channel)) {
        return container.reply = "There's already a game running in this channel. Please, change channels...";
    }

    let gameObject = new game.Game(player1, player2);
    gameMap.set(channel, gameObject);
    container.reply = gameObject.beautify();
});

emitter.on('move', (msg, moveNotation, container) => {
    let gameObject = gameMap.get(msg.channel);

    if (!gameObject) {
        return container.reply = "There's no game running in this channel! Use the \`create\` command or see \`help create\`.";
    }

    let gameReply = gameObject.move(moveNotation);
    container.reply = gameObject.beautify();
    if (gameReply) container.reply += gameReply;
});