const gameStates = require('../../game-manager/game-states');
//Code for connect four game

var cont = {};

'use strict';

class Game {
    //Notes:
    //First player (starting player) is notes as 1, the second is notes as 2, neither is noted as 0
    emojiMoves = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];
    gameState = gameStates.STILL_PLAYING;

    constructor(player1, player2) {
        this.gameName = 'connect-four';
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

                if (this.hasPlayerWon(column, i)) {
                    if (this.firstPlayerOnMove) {
                        this.gameState = gameStates.FIRST_PLAYER_WIN;
                    }
                    else {
                        this.gameState = gameStates.SECOND_PLAYER_WIN;
                    }
                    return;
                }
                if (this.isStalemate()) {
                    this.gameState = gameStates.STALEMATE;
                    return;
                }

                this.firstPlayerOnMove = !this.firstPlayerOnMove;

                return;
            }
        }

        return "You can't play there!";
    }

    parseReaction(reaction) {
        for (let i = 0; i < this.emojiMoves.length; i++) {
            if (reaction.emoji.name == this.emojiMoves[i]) return i;
        }
        return -1;
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

    getReactions() {
        return this.emojiMoves;
    }

    hasPlayerWon(x, y) {
        let checkDirections = [[1, 0], [0, 1], [1, 1], [1, -1]];
        let currentColor = this.board[x][y];

        //One because we know there's at least one color
        let colorsInRow = 1;
        for (let currentDirectionNumber = 0; currentDirectionNumber < checkDirections.length; currentDirectionNumber++) {
            let currentDirection = checkDirections[currentDirectionNumber];
            colorsInRow = 1;

            for (let i = 0; i < 3; i++) {
                let currentX = x + currentDirection[0] * (1 + i);
                let currentY = y + currentDirection[1] * (1 + i);
                if (currentX >= 0 && currentX < this.board.length && currentY >= 0 && currentY < this.board[0].length && 
                        this.board[currentX][currentY] == currentColor) {
                    colorsInRow++;
                }
                else {
                    break;
                }
            }
            
            if (colorsInRow >= 4) {
                return true;
            }

            for (let i = 0; i < 3; i++) {
                let currentX = x + currentDirection[0] * -(1 + i);
                let currentY = y + currentDirection[1] * -(1 + i);
                if (currentX >= 0 && currentX < this.board.length && currentY >= 0 && currentY < this.board[0].length && 
                        this.board[currentX][currentY] == currentColor) {
                    colorsInRow++;
                }
                else {
                    break;
                }
            }
            
            if (colorsInRow >= 4) {
                return true;
            }

        }

        return false;
    }

    isStalemate() {

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                if (this.board[i][j] == 0) {
                    return false;
                }
            }
        }

        return true;
    }

}

cont.Game = Game;

module.exports = cont;
