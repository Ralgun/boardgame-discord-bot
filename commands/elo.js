const emitter = require('../event-emitter').emitter;
const db = require('../database');

module.exports = {
    name: `elo`,
    description: `List elo of player in a specified game`,
    usage: `@<player> <game-name>`,
    args: true,
    async execute(message, args) {
        let targetPlayer = message.mentions.users.first();

        if (!targetPlayer) {
            return false;
        }

        const checkGameCont = {};

        emitter.emit('check-game', args[1], checkGameCont);

        if (!checkGameCont.returnedValue) {
            return message.channel.send(`I don't know a game by the name \`${args[1]}\`. See \`list-games\` command.`);
        }
        
        let row = await db.fetchOne(targetPlayer.id, message.channel.id, args[1]);

        if (!row) {
            //Didn't find the row
            row = db.addOne(targetPlayer.id, message.channel.id, args[1]);
            if(!row) {
                //Failed while trying to add the table
                return message.channel.send(`There was an error while trying to add to the database. :(`);
            }
        }
            
        return message.channel.send(`\`${targetPlayer.username}\` has \`${row.elo}\` elo after \`${row.games_played}\` games of \`${args[1]}\`. Their highest elo being \`${row.highest_elo}\``);
    }
}