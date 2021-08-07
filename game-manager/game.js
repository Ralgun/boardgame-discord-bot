const gameStates = require('./game-states');
const returnCodes = require('./return-codes');

class GameWrapper {
    player0Id;
    player1Id;
    game;
    idToMove;
    isGameOver = false;

    constructor(player0Id, player1Id, game) {
        this.player0Id = player0Id;
        this.player1Id = player1Id;
        this.game = game;
    }

    move(moveNotation, playerId, settings) {
        if (!settings) {
            settings = {};
        }
        if (!moveOrderCheck(playerId)) {
            return;
        };

        if (settings.reaction) {
            // Parse reactions
            moveNotation = this.#translateReaction(moveNotation);
            if (moveNotation === returnCodes.GENERIC_FAIL) {
                return;
            }
        }

        let gameReply = gameObject.move(moveNotation);

        // Check if the game ended
        if (game.state === gameStates.STILL_PLAYING) {
            return gameReply;
        }
        
        await endGame(msg, container, gameObject);
    }

    #endGame() {

    }

    #translateReaction(moveReaction) {
        return game.parseReaction(moveReaction);
    }

    #moveOrderCheck(playerId) {

    }

    getBoard() {

    }

    getReactions() {

    }

}

module.exports = GameWrapper;