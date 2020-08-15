//Default model:
//<guild name>.<gameboard> = table name
//{
//  playerId
//  ELO
//}

const emitter = require('../event-emitter').emitter;
const Sequelize = require('sequelize');

const DEFAULT_ELO = 1500;

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: true,
	storage: 'database.sqlite',
});

const eloTable = require('./models/elo')(sequelize, Sequelize.DataTypes);

sequelize.sync().then(async () => {
	console.log('Database synced');
}).catch(console.error);

/*
let testTable = sequelize.define(`<#734534602902863884>-connect-four`, defaultModel, {freezeTableName: true});
testTable.sync();
tableMap.set("<#734534602902863884>-connect-four", testTable);
*/
const container = {};

async function fetchOne(playerIdArg, channelIdArg, gameArg) {
	return await eloTable.findOne({ where: { playerId: playerIdArg, channelId: channelIdArg, game: gameArg } });
}

async function addOne(playerIdArg, channelIdArg, gameArg) {
	try {
		return await eloTable.create({
			playerId: playerIdArg,
			channelId: channelIdArg,
			game: gameArg,
			elo: DEFAULT_ELO,
		});
	}
	catch (e) {
		console.log("Failed to write to the database!");
		console.log(e);
	}
}

container.fetchOne = fetchOne;
container.addOne = addOne;

module.exports = container;