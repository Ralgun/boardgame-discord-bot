const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const eloTable = require('./models/elo.js')(sequelize, Sequelize.DataTypes);

sequelize.sync({ force: true }).then(async () => {
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);