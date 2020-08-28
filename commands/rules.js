const gameManager = require('../game-manager/index');

module.exports = {
    name: `rules`,
    description: `Sends dm with the game rules`,
    usage: `<name-of-the-game>`,
    args: true,
    execute(message, args) {
        let author = message.author;
        
        let reply = gameManager.getRules(args[0]);
        author.send(reply, {split: true});
        return true;
    }
}