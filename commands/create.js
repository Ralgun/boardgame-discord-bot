const gameManager = require('../game-manager/index');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: `create`,
    description: `Creates a game`,
    usage: `<name-of-the-game> @<other-player>`,
    args: true,
    async execute(message, args) {
        let firstMention = message.mentions.users.first();
        let author = message.user;
        let channel = message.channel;
        let guild = message.guild;
        const players = [message.author, firstMention];

        let cont = {};

        if (!firstMention) {
            return false;
        }
     
        if (firstMention.id == author.id) {
            return channel.send("You can't target yourself!");
        }
        if (gameManager.isChannelTaken(channel.id)) {
            return channel.send("There already is a game in this channel!");                
        }

        // Wait for consent
        let allThePlayers = "";
        players.forEach(player => {
            allThePlayers += `<@${player.id}>, `
        });

        channel.send(`The game will start after ${allThePlayers} write \`accept\``);

        const filter = m => {
            if (m.content != `accept`) {
                return false;
            }
            let bool = false;
            players.forEach(player => {
                if (player.id == m.author.id) {
                bool = true;
                }
            });
            return bool;
        }
        const collector = channel.createMessageCollector({filter, time: 25000 });

        let foundAll = false;
        let playerMap = new Map();
        collector.on('collect', m => {
            console.log("FOUND");
            playerMap.set(m.author.id, true);
            if (playerMap.size == players.length) {
                foundAll = true;
                collector.stop()
            };
        });

        collector.on('end', async m => {
            if (!foundAll) {
                channel.send('The game wasn\'t accepted!');
                return;
            }

            channel.send(`The game is starting!`);
            let game = await gameManager.createGame(channel, guild, [author, firstMention], args[0]);
            if (!game) {
                return channel.send("Failed to create the game. Please, try again.");
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


            message.channel.send({content: game.getBoard(), components: rows});
        });
        return true;
    }
}
