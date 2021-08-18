
//Dependencies
const fs = require('fs');
const eloCounter = require('./elo-counter');
const elo = require('../database/models/elo');
const config = require('../config');
const userFactory = require('../user/userFactory');
const GameWrapper = require('./game');
const gameEvents  = require('./game-events');
const { env } = require('process');

const gameMap = new Map();
const gameModulesMap = new Map();

const gameFiles = fs.readdirSync('games');
for (const file of gameFiles) {
    const gameModule = require(`../games/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module

    // Ignore the dummy game used for testing when on production
    if (gameModule.name == "dummy-game" && process.env.ENV == "production") continue;
    gameModulesMap.set(gameModule.name, gameModule);
}

const container = {};

function isChannelTaken(channelId) {
    return !!gameMap.get(channelId);
}

function createGame(channel, guild, players, gameModuleName, container) {
    
    if (gameMap.get(channel)) {
        return container.reply = "There's already a game running in this channel. Please, change channels...";
    }

    let gameModule = gameModulesMap.get(gameModuleName);
    if(!gameModule) return container.reply = `No kind of game named ${gameModuleName} was found. :(`;

    let gameObject = new gameModule.Game();
    let wrappedGame = new GameWrapper(channel.id, guild.id, players[0].id, players[1].id, gameObject);
    gameMap.set(channel.id, wrappedGame);

    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        userFactory.getOneUser(guild.id, gameModuleName, player.id).then((row) => {
            if (!row) {
                userFactory.createNewUser(guild.id, gameModuleName, player.id);
            }
        });
    }
    return wrappedGame;
}

function getGame(channelId) {
    return gameMap.get(channelId);
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
container.getRules = getRules;
container.listGames = listGames;
container.checkGame = checkGame;
container.isChannelTaken = isChannelTaken;
container.getGame = getGame;

module.exports = container;
