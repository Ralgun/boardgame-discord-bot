const emitter = require('../event-emitter').emitter;

module.exports = {
    name: `list-games`,
    description: `List all the boardgames`,
    execute(message, args) {
        let cont = {};
        
        emitter.emit('list-games', cont);
        message.author.send(`\`${cont.reply}\``, {split: true});
        return true;
    }
}