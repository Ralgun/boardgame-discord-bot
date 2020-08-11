
module.exports = {
    name: `ping`,
    aliases: [`pingalias`],
    description: `I don't know`,
    usage: `<text>`,
    args: true,
    execute(message, args) {
        message.channel.send(`pong ${args[0]}`);
    }
}