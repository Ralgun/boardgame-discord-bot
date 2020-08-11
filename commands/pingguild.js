module.exports = {
    name: `pingguild`,
    description: `I don't know`,
    usage: `<text>`,
    args: true,
    guildOnly: true,
    execute(message, args) {
        message.channel.send(`pong ${args[0]}`);
    }
}