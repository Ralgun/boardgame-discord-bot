const Saveable = require('../database/saveable')
const userSchema = require('../database/models/elo');

class User extends Saveable {
    constructor(serverId, gameTag, userId, elo, highestElo, gamesPlayed, _id) {
        super(userSchema.collection, _id);
        this.data.serverId = serverId;
        this.data.gameTag = gameTag;
        this.data.userId = userId;
        this.data.elo = elo;
        this.data.highestElo = highestElo;
        this.data.gamesPlayed = gamesPlayed;
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

    get highestElo() {
        return this.data.highestElo;
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

    get gamesPlayed() {
        return this.data.gamesPlayed;
    }

    incrementGames() {
        return this.data.gamesPlayed++;
    }

}

module.exports = User;
