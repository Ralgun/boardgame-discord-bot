const gameManager = require('../game-manager/index');

module.exports = {
    name: `play`,
    description: `Plays a move, see `, //TODO: Help files for games
    usage: `<notation-for-move>`,
    args: true,
    async execute(message, args) {
        let cont = {};
        await gameManager.move(message, args[0], cont);
        message.channel.send(cont.reply);
        console.log("Wrote the reply");
    }
}