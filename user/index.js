const Saveable = require('../database/saveable')

class User extends Saveable {
    constructor(serverId, gameTag, userId, elo, highestElo) {
        this.data = {};
        this.data.serverId = serverId;
        this.data.gameTag = gameTag;
        this.data.userId = userId;
        this.data.elo = elo;
        this.highestElo = highestElo;
    }

    get elo() {
        return this.data.elo;
    }

    // Returns true if the highest elo was overwritten
    set elo(val) {
        this.data.elo = val;
        if (val <= this.data.highestElo) return false;
        this.data.highestElo = val;
        return true;
    }
    
    get serverId() {
        return this.data.serverId;
    }
    
    get userId() {
        return this.data.userId;
    }

    get gameTag() {
        return this.data.gameTag;
    }

}

module.exports = User;
