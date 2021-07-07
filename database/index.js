const emitter = require('../event-emitter').emitter;
const config = require('../config.json');
const mongoose = require('mongoose');

mongoose.connect(config.db['mongodb-host'], {useNewUrlParser: true, useUnifiedTopology: true}, (error) => {
    if (error) console.log(error)
    console.log("Connected!");
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function() {
    console.log("Connection to mongodb successful!")
});

module.exports = db;
