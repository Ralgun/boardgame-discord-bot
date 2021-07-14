const allConfigs = {
    production: {
        default_elo: 1500,
        prefix: "b!",
        token: "YOUR-DISCORDBOT-TOKEN-HERE",
        "mongodb-host": "mongodb://localhost/discord-bot-boardgames"
    },
    staging: {
        default_elo: 1500,
        prefix: "b!",
        token: "YOUR-DISCORDBOT-TOKEN-HERE",
        "mongodb-host": "mongodb://localhost/discord-bot-boardgames-staging"
    },
    testing: {
        default_elo: 1500,
        prefix: "b!",
        token: "YOUR-DISCORDBOT-TOKEN-HERE",
        "mongodb-host": "mongodb://localhost/discord-bot-boardgames-testing"
    }
}

let env = process.env.ENV;
if (env != "production") {
    for (let i = 0; i < 5; i++) {
        console.log("!!NOT RUNNING ON PRODUCTION!!");
    }
}

module.exports = allConfigs[process.env.ENV];
