const cont = {};

const subbedToGameEnd = [];

function subToGameEnd(func) {
    subbedToGameEnd.push(func);
}

function emitGameEnd(channelId, guildId) {
    subbedToGameEnd.forEach(func => {
        func(channelId, guildId);
    });
}

cont.subToGameEnd = subToGameEnd;
cont.emitGameEnd = emitGameEnd;
module.exports = cont;