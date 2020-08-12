
//Dependencies
const emitter = require('../event-emitter').emitter;
const fs = require('fs');

const gameMap = new Map();
const gameModulesMap = new Map();

const gameFiles = fs.readdirSync('games');
for (const file of gameFiles) {
    const gameModule = require(`../games/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    gameModulesMap.set(gameModule.name, gameModule);
}

emitter.on('create-game', (channel, player1, player2, gameModuleName, container) => {
    if (gameMap.get(channel)) {
        return container.reply = "There's already a game running in this channel. Please, change channels...";
    }

    let gameModule = gameModulesMap.get(gameModuleName);
    if(!gameModule) return container.reply = `No kind of game named ${gameModuleName} was found. :(`;

    let gameObject = new gameModule.Game(player1, player2);
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

emitter.on('get-rules', (gameModuleName, cont) => {
    let gameModule = gameModulesMap.get(gameModuleName);
    if (!gameModule) return cont.reply = "There's no game with that name :(";
    
    let data = gameModule.data;

    let rules = data.rules ? `${data.rules}\n` : ``;
    let move = data.move ? `${data.move}\n` : ``;
    let goal = data.goal ? `${data.goal}\n` : ``;
    let examples = data.examples ? `${data.examples}\n` : ``;
    let notation = data.notation ? `${data.notation}\n` : ``;

    return cont.reply = `${rules}${move}${goal}${examples}${notation}`;
})