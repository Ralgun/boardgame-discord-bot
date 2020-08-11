const emitter = require('../event-emitter').emitter;

module.exports = {
    name: `create`,
    description: `Creates a game`,
    usage: `<name-of-the-game> @<other-player>`,
    args: true,
    execute(message, args) {
        let firstMention = message.mentions.users.first();
        let author = message.author;

        let cont = {};

        if(firstMention) {    //TODO: Once I'm done with the testing, I should check if the second player is the author
            emitter.emit('create-game', message.channel, author, firstMention, args[0], cont);
            message.channel.send(cont.reply);
            return true;
        }
        return false;
    }
}