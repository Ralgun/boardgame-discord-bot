const gameStates = require('./game-states');
const returnCodes = require('./return-codes');
const gameEvents = require('./game-events');
const userFactory = require('../user/userFactory');
const eloCounter = require('./elo-counter');

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

    async move(moveNotation, playerId) {
        if (!this.#moveOrderCheck(playerId)) {
            return {reply: "It's not your move", success: false};
        };

        let {reply, success} = this.game.move(moveNotation);
        if (success) {
            this.playerToMove = this.playerToMove == 1 ? 0 : 1;
        }

        // Check if the game ended
        if (this.game.state == gameStates.STILL_PLAYING) {
            return {reply: reply, success: true};
        }
        console.log("The game ended");
        return {reply: await this.#endGame(), success: true};
    }

    async #endGame() {
        gameEvents.emitGameEnd(this.channelId, this.guildId);
        this.isGameOver = true;

        let reply = "";
        if (this.game.state == gameStates.STALEMATE) {
            reply += `\nThe game ended in a draw!`;
        }
        else {
            // TODO
            reply += `\n<@${this.game.state == gameStates.FIRST_PLAYER_WIN ? this.player0Id : this.player1Id}> won!`;
        }
        let winnerNotation = .5;

        if (this.game.state == gameStates.FIRST_PLAYER_WIN) {
            winnerNotation = 1;
        }
        else if (this.game.state == gameStates.SECOND_PLAYER_WIN) {
            winnerNotation = 0;
        }

        let p1Row = await userFactory.getOneUser(this.guildId, this.game.gameName, this.player0Id);
        let p2Row = await userFactory.getOneUser(this.guildId, this.game.gameName, this.player1Id);

        let oldP1Elo = p1Row.elo;
        let oldP2Elo = p2Row.elo;

        let results = eloCounter.calculateElo(oldP1Elo, p1Row.games_played, p1Row.highest_elo, oldP2Elo, p2Row.games_played, p2Row.highest_elo, winnerNotation);

        reply += `\n<@${this.player0Id}> has now \`${results[0]}\` elo!`;
        reply += `\n<@${this.player1Id}> has now \`${results[1]}\` elo!`;

        p1Row.incrementGames();
        p1Row.elo = results[0];
        p2Row.incrementGames();
        p2Row.elo = results[1];
        
        p1Row.save();
        p2Row.save();
        return reply;
    }

    #moveOrderCheck(playerId) {
        return ((this.playerToMove == 0 && playerId == this.player0Id) || 
        (this.playerToMove == 1 && playerId == this.player1Id))
    }

    getBoard() {
        return this.game.beautify();
    }

    getButtons() {
        return this.game.getButtons();
    }

}

module.exports = GameWrapper;
