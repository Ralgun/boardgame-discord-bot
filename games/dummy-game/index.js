const game = require('./game.js');
const data = require('./data.json');

var cont = {};

cont.Game = game;
cont.name = "dummy-game";
cont.data = data;

module.exports = cont;