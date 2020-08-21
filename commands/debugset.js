const gameManager = require('../game-manager/index');
const db = require('../database');

module.exports = {
    name: `debugset`,
    description: `Sets stuff`,
    usage: `@<other-player> <name-of-the-game> <elo> <number-of-games>`,
    args: true,
    execute(message, args) {
        let firstMention = message.mentions.users.first();
        let author = message.author;

        let cont = {};

        if (firstMention && gameManager.checkGame(args[1]) && args[2] && args[3]) {
            db.updateOne(firstMention.id, message.channel.id, args[1], args[2], args[3]);
            message.channel.send("Changed");
            return true;
        }
        return false;
    }
}