
const EventEmitter = require('events');
const { emit } = require('process');

class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

var cont = {};

cont.emitter = emitter;
module.exports = cont;