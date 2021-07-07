const mongoose = require('mongoose');
const config = require('../../config.json');
const DEFAULT_ELO = config['default_elo'];

const cont = {};

const schema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    serverId: {
        type: Number,
        required: true
    },
    gameTag: {
        type: String,
        required: true
    },
    elo: {
        type: Number,
        default: DEFAULT_ELO
    },
    highestElo: {
        type: Number,
        default: DEFAULT_ELO
    }
});

schema.index({serverId: 1, gameTag: 1, userId: 1}, {unique: true});

cont.schema = schema;
cont.collection = "user";

module.exports = cont;
