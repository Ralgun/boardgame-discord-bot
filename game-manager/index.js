
//Dependencies
const emitter = require('../event-emitter').emitter;
const fs = require('fs');
const eloCounter = require('./elo-counter');
const db = require('../database');
const elo = require('../database/models/elo');
const config = require('../config.json');

const gameMap = new Map();
const gameModulesMap = new Map();

const gameFiles = fs.readdirSync('games');
for (const file of gameFiles) {
    const gameModule = require(`../games/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    gameModulesMap.set(gameModule.name, gameModule);
}

const container = {};

function createGame(channel, player1, player2, gameModuleName, container) {
    if (gameMap.get(channel)) {
        return container.reply = "There's already a game running in this channel. Please, change channels...";
    }

    let gameModule = gameModulesMap.get(gameModuleName);
    if(!gameModule) return container.reply = `No kind of game named ${gameModuleName} was found. :(`;

    let gameObject = new gameModule.Game(player1, player2);
    gameObject.isGameRunning = false;
    gameMap.set(channel.id, gameObject);

    db.fetchOne(player1.id, channel.id, gameModuleName).then((row) => {
        if (!row) {
            db.addOne(player1.id, channel.id, gameModuleName);
        }
    });
    db.fetchOne(player2.id, channel.id, gameModuleName).then((row) => {
        if (!row) {
            db.addOne(player2.id, channel.id, gameModuleName);
        }
    });

    container.reply = `The game will start after <@${player2.id}> writes \`accept\``;

    const filter = m => m.author.id == player2.id && m.content == `accept`;
    const collector = channel.createMessageCollector(filter, { time: 25000 });

    collector.on('collect', m => {
        console.log(`Collected ${m.content}`);

        channel.send(`The game is starting!`);
        channel.send(gameObject.beautify());
        gameObject.isGameRunning = true;

        collector.stop();
    });

    collector.on('end', m => {
        if (m.size == 0) {
            channel.send('The game wasn\'t accepted!');
            gameMap.delete(channel);
        }
    });

}

async function move(msg, moveNotation, container) {
    let gameObject = gameMap.get(msg.channel.id);

    if (!gameObject) {
        return container.reply = "There's no game running in this channel! Use the \`create\` command or see \`help create\`.";
    }
    else if (!gameObject.isGameRunning) {
        return container.reply = "The game wasn't accepted!";
    }

    let gameReply = gameObject.move(moveNotation);
    container.reply = gameObject.beautify();
    if (gameReply) container.reply += gameReply;

    if (gameObject.gameWonBy == null && !gameObject.isStalemateBool) {
        return;
    }

    gameMap.delete(msg.channel);
    container.reply += `The game between <@${gameObject.player1.id}> and <@${gameObject.player2.id}> is over!`;

    if (gameObject.isStalemateBool) {
        container.reply += `\nThe game ended in a draw!`;
    }
    else {
        container.reply += `\n<@${gameObject.gameWonBy.id}> won!`;
    }

    //Elo stuff
    let winnerNotation = .5;

    if (gameObject.gameWonBy == gameObject.player1) {
        winnerNotation = 1;
    }
    else if (gameObject.gameWonBy == gameObject.player2) {
        winnerNotation = 0;
    }

    let p1Row = await db.fetchOne(gameObject.player1.id, msg.channel.id, gameObject.gameName);
    let p2Row = await db.fetchOne(gameObject.player2.id, msg.channel.id, gameObject.gameName);

    let oldP1Elo = p1Row.elo;
    let oldP2Elo = p2Row.elo;

    let results = eloCounter.calculateElo(oldP1Elo, p1Row.games_played, p1Row.highest_elo, oldP2Elo, p2Row.games_played, p2Row.highest_elo, winnerNotation);

    container.reply += `\n<@${gameObject.player1.id}> has now \`${results[0]}\` elo!`;
    container.reply += `\n<@${gameObject.player2.id}> has now \`${results[1]}\` elo!`;

    db.updateOne(p1Row.playerId, p1Row.channelId, p1Row.game, results[0], p1Row.games_played + 1);
    db.updateOne(p2Row.playerId, p2Row.channelId, p2Row.game, results[1], p2Row.games_played + 1);
}

function getRules(gameModuleName) {
    let gameModule = gameModulesMap.get(gameModuleName);
    if (!gameModule) return cont.reply = "There's no game with that name :(";
    
    let data = gameModule.data;

    let rules = data.rules ? `${data.rules}\n` : ``;
    let move = data.move ? `${data.move}\n` : ``;
    let goal = data.goal ? `${data.goal}\n` : ``;
    let examples = data.examples ? `${data.examples}\n` : ``;
    let notation = data.notation ? `${data.notation}\n` : ``;

    return `${rules}${move}${goal}${examples}${notation}`;
}

function listGames() {
    let keys = Array.from(gameModulesMap.keys());
    return keys.join('\n');
}

function checkGame(gameName) {
    return gameModulesMap.get(gameName) != undefined;
}

container.createGame = createGame;
container.move = move;
container.getRules = getRules;
container.listGames = listGames;
container.checkGame = checkGame;

module.exports = container;