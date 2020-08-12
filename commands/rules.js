const emitter = require('../event-emitter').emitter;

module.exports = {
    name: `rules`,
    description: `Sends dm with the game rules`,
    usage: `<name-of-the-game>`,
    args: true,
    execute(message, args) {
        let author = message.author;

        let cont = {};
        
        emitter.emit('get-rules', args[0], cont);
        author.send(cont.reply, {split: true});
        return true;
    }
}