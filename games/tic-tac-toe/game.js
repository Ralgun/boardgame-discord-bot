//Code for tic-tac-toe

var cont = {};

'use strict';

class Game {

    //Notes:
    //First player (starting player) is notes as 1, the second is notes as 2, neither is noted as 0

    constructor() {
        this.gameName = 'tic-tac-toe';
        this.firstPlayerOnMove = true;

        //Create the board
        let board = new Array(3);
        for (let i = 0; i < board.length; i++) {
            let newArray = new Array(3);
            for (let j = 0; j < newArray.length; j++) {
                newArray[j] = 0;
            }
            board[i] = newArray;
        }
        this.board = board;
    }

    //For connect four we only need a number
    move(moveNotation) {
        if (isNaN(moveNotation)) return "You need to use a **number**!";

        let column = parseInt(moveNotation.charAt(0));
        let row = parseInt(moveNotation.charAt(1));
        if ((column < 0 || column > this.board.length-1) && (row < 0 || row > this.board[0].length-1)) {
            return "The notation must be a pair of numbers (0-2)!";
        }

        if (this.board[column][row] == 0) {
            this.board[column][row] = this.firstPlayerOnMove ? 1 : 2;
            this.firstPlayerOnMove = !this.firstPlayerOnMove;
            return;
        }

        return "You can't play there!";
    }

    beautify() {
        let string = "";
        for (let y = this.board[0].length-1; y >= 0; y--) {
            for (let x = 0; x < this.board.length; x++) {
                let currentPlace = this.board[x][y];
                if (currentPlace == 0) string += ":white_large_square:";
                else if (currentPlace == 1) string += ":o:";
                else if (currentPlace == 2) string += ":x:";
            }
            string += "\n";
        }
        return string;
    }

}

cont.Game = Game;

module.exports = cont;