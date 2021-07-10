const emitter = require('../event-emitter').emitter;
const userFactory = require('../user/userFactory');

const gameManager = require('../game-manager/index');

module.exports = {
    name: `elo`,
    description: `List elo of player in a specified game`,
    usage: `@<player> <game-name>`,
    args: true,
    async execute(message, args) {
        let targetPlayer = message.mentions.users.first();
        console.log(targetPlayer);

        if (!targetPlayer) {
            return false;
        }

        let checkGameCont = gameManager.checkGame(args[1]);

        if (!checkGameCont) {
            return message.channel.send(`I don't know a game by the name \`${args[1]}\`. See \`list-games\` command.`);
        }
        
        let row = await userFactory.getOneUser(message.guild.id, args[1], targetPlayer.id);

        if (!row) {
            //Didn't find the row
            const row = await userFactory.createNewUser(message.guild.id, args[1], targetPlayer.id);
            if(!row) {
                //Failed while trying to add the table
                return message.channel.send(`There was an error while trying to add to the database. :(`);
            }
        }

        row = await userFactory.getOneUser(message.guild.id, args[1], targetPlayer.id);
            
        return message.channel.send(`\`${targetPlayer.username}\` has \`${row.elo}\` elo after \`${row.gamesPlayed}\` games of \`${args[1]}\`. Their highest elo being \`${row.highestElo}\``);
    }
}
