//Default model:
//<guild name>.<gameboard> = table name
//{
//  playerId
//  ELO
//}

const emitter = require('../event-emitter').emitter;
const Sequelize = require('sequelize');

const DEFAULT_ELO = 1500;

const tableMap = new Map();

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: true,
	// SQLite only
	storage: 'database.sqlite',
});

const defaultModel = {
	playerId: {
		type: Sequelize.TEXT,
		unique: true,
		allowNull: false,
	},
	elo: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
};

let testTable = sequelize.define(`<#734534602902863884>-connect-four`, defaultModel, {freezeTableName: true});
testTable.sync();
tableMap.set("<#734534602902863884>-connect-four", testTable);

const container = {};

container.getElo = async function(playerIdArg, channel, game, shouldCreateNewElo, cont) {
    let table = tableMap.get(`${channel}-${game}`);
	
    if (!table) {
        table = sequelize.define(`${channel}-${game}`, defaultModel, {freezeTableName: true});
        table.sync();
        tableMap.set(`${channel}-${game}`, table);
    }

	const row = await table.findOne({ where: { playerId: playerIdArg } });
	
	if (row) {
		console.log(row.get('elo').toString());
		return row;
	}
	if (shouldCreateNewElo === false) {
		return cont.error = "noPlayerFound";
	}

	try {
		const newRow = await table.create({
			playerId: playerIdArg,
			elo: 1500,
		});
	}
	catch (e) {
		console.log(e);
	}
}

module.exports = container;