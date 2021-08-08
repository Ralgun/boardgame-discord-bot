
//Dependencies
const fs = require('fs');
const eloCounter = require('./elo-counter');
const elo = require('../database/models/elo');
const config = require('../config');
const userFactory = require('../user/userFactory');
const GameWrapper = require('./game');
const gameEvents  = require('./game-events');

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

function isChannelTaken(channelId) {
    return !gameMap.get(channelId);
}

function createGame(channel, guild, players, gameModuleName, container) {
    
    if (gameMap.get(channel)) {
        return container.reply = "There's already a game running in this channel. Please, change channels...";
    }

    let gameModule = gameModulesMap.get(gameModuleName);
    if(!gameModule) return container.reply = `No kind of game named ${gameModuleName} was found. :(`;

    let gameObject = new gameModule.Game(players[0], players[1]);
    let wrappedGame = new GameWrapper(players[0].id, players[1].id, gameObject);
    gameMap.set(channel.id, wrappedGame);

    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        userFactory.getOneUser(guild.id, gameModuleName, player.id).then((row) => {
            if (!row) {
                userFactory.createNewUser(guild.id, gameModuleName, player.id);
            }
        });
    }
}

function getGame(channelId) {
    return gameMap.get(channelId);
}

async function endGame(msg, container, gameObject) {

    // gameMap.delete(msg.channel.id);
    // container.reply += `The game between <@${gameObject.player1.id}> and <@${gameObject.player2.id}> is over!`;

    // if (gameObject.isStalemateBool) {
    //     container.reply += `\nThe game ended in a draw!`;
    // }
    // else {
    //     container.reply += `\n<@${gameObject.gameWonBy.id}> won!`;
    // }
    // let winnerNotation = .5;

    // if (gameObject.gameWonBy == gameObject.player1) {
    //     winnerNotation = 1;
    // }
    // else if (gameObject.gameWonBy == gameObject.player2) {
    //     winnerNotation = 0;
    // }

    // let p1Row = await userFactory.getOneUser(msg.guild.id, gameObject.gameName, gameObject.player1.id);
    // let p2Row = await userFactory.getOneUser(msg.guild.id, gameObject.gameName, gameObject.player2.id);

    // let oldP1Elo = p1Row.elo;
    // let oldP2Elo = p2Row.elo;

    // let results = eloCounter.calculateElo(oldP1Elo, p1Row.games_played, p1Row.highest_elo, oldP2Elo, p2Row.games_played, p2Row.highest_elo, winnerNotation);

    // container.reply += `\n<@${gameObject.player1.id}> has now \`${results[0]}\` elo!`;
    // container.reply += `\n<@${gameObject.player2.id}> has now \`${results[1]}\` elo!`;

    // p1Row.incrementGames();
    // p1Row.elo = results[0];
    // p2Row.incrementGames();
    // p2Row.elo = results[1];
    
    // p1Row.save();
    // p2Row.save();
}

function getRules(gameModuleName) {
    let gameModule = gameModulesMap.get(gameModuleName);
    if (!gameModule) return "There's no game with that name :(";
    
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

gameEvents.subToGameEnd((channelId, guildId) => {
    gameMap.delete(channelId);
})

container.createGame = createGame;
container.move = move;
container.getRules = getRules;
container.listGames = listGames;
container.checkGame = checkGame;
container.moveReaction = moveReaction;
container.isChannelTaken = isChannelTaken;
container.getGame = getGame;

module.exports = container;
