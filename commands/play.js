const gameManager = require('../game-manager/index');

module.exports = {
    name: `play`,
    description: `Plays a move, see `, //TODO: Help files for games
    usage: `<notation-for-move>`,
    args: true,
    async execute(message, args) {
        let cont = {};
        await gameManager.move(message, args[0], cont);
        message.channel.send(cont.reply).then(async sentMsg => {
            if (!cont.emojis) return;
            try {
                for (let i = 0; i < cont.emojis.length; i++) {
                    await sentMsg.react(cont.emojis[i]);
                }
            } catch (error) {
			    console.error('One of the emojis failed to react:', error);
		    }
        });
    }
}
