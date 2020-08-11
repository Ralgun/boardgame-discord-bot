const emitter = require('../event-emitter').emitter;

module.exports = {
    name: `play`,
    description: `Plays a move, see `, //TODO: Help files for games
    usage: `<notation-for-move>`,
    args: true,
    execute(message, args) {
        let cont = {};
        emitter.emit('move', message, args[0], cont);
        message.channel.send(cont.reply);
    }
}