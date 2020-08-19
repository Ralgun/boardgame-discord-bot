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

        if (firstMention) {
            if (firstMention.id == author.id) {
                return message.channel.send("You can't target yourself!");
            }
            emitter.emit('create-game', message.channel, author, firstMention, args[0], cont);
            message.channel.send(cont.reply);
            return true;
        }
        return false;
    }
}