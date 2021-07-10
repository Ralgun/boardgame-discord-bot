const config = require('../config.json');
const User = require('./index');
const mongoReference = require('../database/mongoReference');

const provider = mongoReference.getModel('user');
const DEFAULT_ELO = config['default_elo'];

const cont = {};

async function createNewUser(serverId, gameTag, userId) {
    let user = new User(serverId, gameTag, userId, DEFAULT_ELO, DEFAULT_ELO, 0);
    await user.create();

    return user;
}

function createUserFromData(data) {
    return new User(data.serverId, data.gameTag, data.userId, data.elo, data.highestElo, data.gamesPlayed, data._id);
}

async function getOneUser(serverId, gameTag, userId) {
    let res = await provider.getByFilter({ serverId: serverId, gameTag: gameTag, userId: userId });
    console.log("aaaaa");
    console.log(res);
    if (res.length < 1) return false;
    res = res[0];
    return createUserFromData(res);
}

cont.createNewUser = createNewUser;
cont.getOneUser = getOneUser;

module.exports = cont;
