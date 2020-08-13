const emitter = require('../event-emitter').emitter;
const db = require('../database');

module.exports = {
    name: `elo`,
    description: `List elo of player in a specified game`,
    usage: `<game-name>`,
    args: true,
    execute(message, args) {
        
        let gameCheckCont = {};

        emitter.emit('check-game', args[0], gameCheckCont)

        if (!gameCheckCont.returnedValue) {
            return message.channel.send(`That game wasn't found, try \`list-games\` command.`);
        }
        
        let cont = {};
        
        let row = db.getElo(message.author.id, message.channel, args[0], true, cont);
        
        if (row) {
            row.then(result => {
                message.channel.send(`Your elo in \`${args[0]}\` is \`${result.elo}\``);
            });
        }
        if (cont.error == "noPlayerFound") {
            return message.channel.send("You don't have any elo in that game!");
        }

    }
}