const gameManager = require('../game-manager/index');
const userFactory = require('../user/userFactory');

module.exports = {
    name: `debugset`,
    description: `Sets stuff`,
    usage: `@<other-player> <name-of-the-game> <elo>`,
    args: true,
    async execute(message, args) {
        let firstMention = message.mentions.users.first();
        let author = message.author;

        let cont = {};

        console.log(firstMention.id)
        if (firstMention && gameManager.checkGame(args[1]) && args[2]) {
            const user = await userFactory.getOneUser(message.guild.id, args[1], firstMention.id);
            console.log(user);
            user.elo = args[2];
            user.save();
            
            message.channel.send("Changed");
            return true;
        }
        return false;
    }
}
