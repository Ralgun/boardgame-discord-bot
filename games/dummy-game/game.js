const gameStates = require('../../game-manager/game-states');

class DummyGame {
    state = gameStates.STILL_PLAYING;
    gameName = "dummy-game";
    move(moveNotation) {
        switch (moveNotation) {
            case "stalemate":
                this.state = gameStates.STALEMATE;
                break;
            case "first":
                this.state = gameStates.FIRST_PLAYER_WIN;
                break;
            case "second":
                this.state = gameStates.SECOND_PLAYER_WIN;
                break;
            default:
                return {success: false, reply: "Not valid"};
        }
        return {success: true, reply: "Valid"};
    }

    beautify() {
        return "Dummy board";
    }
}

module.exports = DummyGame;