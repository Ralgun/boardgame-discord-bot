const fs = require('fs');
const {Client, Intents, Collection} = require('discord.js');
const config = require('./config');
const db = require('./database');

const client = new Client({ intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

const prefix = config.prefix;

function getCorrectUsage(command) {
    if (command.usage) {
        return `The correct usage: \'${prefix}${command.name} ${command.usage}\'`;
    }
}

client.on('ready', () => {
    console.log(`Bot is up and running as ${client.user.tag}`);
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

function searchForCommand(commandName) {
    return client.commands.get(commandName) 
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
}

client.on('messageCreate', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    msg.user = msg.author;
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    let command = searchForCommand(commandName);

    if (!command) return msg.channel.send(`Sorry, ${msg.author}, I don't know that command :(`);

    try {

        if (command.guildOnly && msg.channel.type !== 'text') {
            return msg.reply('I can\'t execute that command inside DMs!');
        }

        if (command.args && !args.length) {
            let reply = "";
            reply += `You didn't provide any arguments, ${msg.author}!`;
            reply += `\n${getCorrectUsage(command)}`;
            return msg.channel.send(reply);
        }

        //TODO put this in then block
        if(await command.execute(msg, args) === false) {
            let reply = `Oh no! You didn't use the command correctly!`;
            reply += `\n${getCorrectUsage(command)}`;
            return msg.reply(reply);
        }

    } catch (error) {
        console.error(error);
        let reply = `There was an error trying to execute that command.`;
        reply += `\n${getCorrectUsage(command)}`;
        msg.reply(reply);
    }

});

client.on('interactionCreate', async (button) => {
    if (!button.isButton()) return;
    button.deferUpdate();
    button.guild = button.member.guild;
    button.channel = await client.channels.fetch(button.channelId);
    const args = button.customId.trim().split(/ +/);
	const type = args.shift().toLowerCase();

    if (type != "command") {
        return;
    } 
    const commandName = args.shift().toLowerCase();
    let command = searchForCommand(commandName);
    if (!command) throw new Error("Button is trying to execute a command that doesn't exist");
    try {
        if(await command.execute(button, args) === false) {
            let reply = `Oh no! You didn't use the command correctly!`;
            reply += `\n${getCorrectUsage(command)}`;
            return msg.reply(reply);
        }

    } catch (error) {
        console.error(error);
    }

});

client.login(config.token);
