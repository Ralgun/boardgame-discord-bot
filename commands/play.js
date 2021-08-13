const gameManager = require('../game-manager/index');

module.exports = {
    name: `play`,
    description: `Plays a move, see `, //TODO: Help files for games
    usage: `<notation-for-move>`,
    args: true,
    async execute(message, args) {
        const game = gameManager.getGame(message.channel.id);
        if (!game) {
            return;
        }
        let {reply, success} = await game.move(args[0], message.author.id);
        if (!reply) reply = "";
        if (game.isGameOver) {
            message.channel.send(reply);
            return;
        }
        reply += game.getBoard();
        message.channel.send(reply).then(async sentMsg => {
            const emojis = game.getEmojis();
            console.log(emojis);
            if (!emojis) return;
            try {
                for (let i = 0; i < emojis.length; i++) {
                    await sentMsg.react(emojis[i]);
                }
            } catch (error) {
			    console.error('One of the emojis failed to react:', error);
		    }
        });
    }
}
