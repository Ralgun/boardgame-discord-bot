const fs = require('fs');
const discord = require('discord.js');
const config = require('./config');
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

const gameManager = require('./game-manager');
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) {
        return;
    }
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
    let cont = await gameManager.moveReaction(user, reaction);
    if (cont && cont.reply) {
        reaction.message.channel.send(cont.reply).then(async sentMsg => {
            if (!cont.emojis) return;
            console.log("emojis!");
            try {
                for (let i = 0; i < cont.emojis.length; i++) {
                    await sentMsg.react(cont.emojis[i]);
                }
            } catch (error) {
			    console.error('One of the emojis failed to react:', error);
		    }
        });
    }
    return;
});

client.login(config.token);
