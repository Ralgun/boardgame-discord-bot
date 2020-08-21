const gameManager = require('../game-manager/index');

module.exports = {
    name: `list-games`,
    description: `List all the boardgames`,
    execute(message, args) {
        let reply = gameManager.listGames();
        message.author.send(`\`${reply}\``, {split: true});
        return true;
    }
}