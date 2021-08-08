const gameStates = require('./game-states');
const returnCodes = require('./return-codes');
const gameEvents = require('./game-events');

class GameWrapper {
    channelId;
    guildId;
    player0Id;
    player1Id;
    game;
    playerToMove = 0;
    isGameOver = false;

    constructor(channelId, guildId, player0Id, player1Id, game) {
        this.channelId = channelId;
        this.guildId = guildId;
        this.player0Id = player0Id;
        this.player1Id = player1Id;
        this.game = game;
    }

    async move(moveNotation, playerId, settings) {
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
        gameEvents.emitGameEnd(this.channelId, this.guildId);

        if (game.gameState == gameStates.STALEMATE) {
            container.reply += `\nThe game ended in a draw!`;
        }
        else {
            // TODO
            container.reply += `\n<@${gameObject.gameWonBy.id}> won!`;
        }
        let winnerNotation = .5;

        if (game.gameState == gameStates.FIRST_PLAYER_WIN) {
            winnerNotation = 1;
        }
        else if (game.gameState == gameStates.SECOND_PLAYER_WIN) {
            winnerNotation = 0;
        }

        let p1Row = await userFactory.getOneUser(msg.guild.id, gameObject.gameName, gameObject.player1.id);
        let p2Row = await userFactory.getOneUser(msg.guild.id, gameObject.gameName, gameObject.player2.id);

        let oldP1Elo = p1Row.elo;
        let oldP2Elo = p2Row.elo;

        let results = eloCounter.calculateElo(oldP1Elo, p1Row.games_played, p1Row.highest_elo, oldP2Elo, p2Row.games_played, p2Row.highest_elo, winnerNotation);

        container.reply += `\n<@${gameObject.player1.id}> has now \`${results[0]}\` elo!`;
        container.reply += `\n<@${gameObject.player2.id}> has now \`${results[1]}\` elo!`;

        p1Row.incrementGames();
        p1Row.elo = results[0];
        p2Row.incrementGames();
        p2Row.elo = results[1];
        
        p1Row.save();
        p2Row.save();
    }

    #translateReaction(moveReaction) {
        return game.parseReaction(moveReaction);
    }

    #moveOrderCheck(playerId) {
        return ((playerToMove == 0 && playerId == this.player0Id) || 
        (playerToMove == 1 && playerId == this.player1Id))
    }

    getBoard() {

    }

    getReactions() {

    }

}

module.exports = GameWrapper;
