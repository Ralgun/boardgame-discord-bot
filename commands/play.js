const { MessageActionRow, MessageButton } = require('discord.js');
const gameManager = require('../game-manager/index');
const embedHelper = require('../helpers/embedCreator');

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
        let {reply, success} = await game.move(args[0], message.user.id);
        if (!success && message.isButton()) {
            return;
        }
        if (!reply) reply = "";
        if (game.isGameOver) {
            message.channel.send(reply);
            return;
        }

        // Creating buttons
        let buttonTexts = game.getButtons();
        let rows = [];
        let row = new MessageActionRow();
        rows.push(row);
        let i = 0;
        buttonTexts.forEach(but => {
            row.addComponents(new MessageButton()
                .setStyle("PRIMARY")
                .setLabel(but)
                .setCustomId(`command play ${but}`)
            );
            if (i++ >= 4) {
                i = 0;
                row = new MessageActionRow();
                rows.push(row);
            }
        });
        

        message.channel.send({components: rows, embeds: [embedHelper.getBoardEmbed(game.getPlayerIdToMove(), game.getBoard(), reply)]});
    }
}
