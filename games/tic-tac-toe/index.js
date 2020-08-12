const game = require('./game.js');
const data = require('./data.json');

var cont = {};

cont.Game = game.Game;
cont.name = "tic-tac-toe";
cont.data = data;

module.exports = cont;