//Code for connect four game

var cont = {};

'use strict';

class Game {

    //Notes:
    //First player (starting player) is notes as 1, the second is notes as 2, neither is noted as 0

    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.firstPlayerOnMove = true;

        //Create the board
        let board = new Array(7);
        for (let i = 0; i < board.length; i++) {
            let newArray = new Array(6);
            for (let j = 0; j < newArray.length; j++) {
                newArray[j] = 0;
            }
            board[i] = newArray;
        }
        this.board = board;
    }

    //For connect four we only need a number
    move(moveNotation) {
        let column;
        if (!isNaN(moveNotation)) column = parseInt(moveNotation);
        else return "You need to use a **number**!"
        if (column < 0 || column > this.board.length-1) return "The notation must be a number corresponding to the column (0-6).";


        let columnArray = this.board[column];

        for (let i = 0; i < columnArray.length; i++) {
            if (columnArray[i] == 0) {
                if (this.firstPlayerOnMove) columnArray[i] = 1;
                else columnArray[i] = 2;

                this.firstPlayerOnMove = !this.firstPlayerOnMove;

                return;
            }
        }

        return "You can't play there!";
    }

    beautify() {
        let string = "";
        for (let y = this.board[0].length-1; y >= 0; y--) {
            for (let x = 0; x < this.board.length; x++) {
                let currentPlace = this.board[x][y];
                if (currentPlace == 0) string += ":white_circle:";
                else if (currentPlace == 1) string += ":yellow_circle:";
                else if (currentPlace == 2) string += ":red_circle:";
            }
            string += "\n";
        }
        return string;
    }

}

cont.Game = Game;

module.exports = cont;