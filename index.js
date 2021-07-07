const fs = require('fs');
const discord = require('discord.js');
const config = require('./config.json');
const db = require('./database');

//PLACEHOLDER TODO
require('./game-manager');

const client = new discord.Client();

const prefix = config.prefix;

function getCorrectUsage(command) {
    if (command.usage) {
        return `The correct usage: \'${prefix}${command.name} ${command.usage}\'`;
    }
}

client.on('ready', () => {
    console.log(`Bot is up and running as ${client.user.tag}`);
});

client.commands = new discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

client.on('message', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    let command = client.commands.get(commandName) 
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

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
        let reply = `There was an error trying to execute that command!`;
        reply += `\n${getCorrectUsage(command)}`;
        msg.reply(reply);
    }

});

client.login(config.token);
