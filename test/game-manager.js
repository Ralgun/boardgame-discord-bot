const assert = require('assert');
const manager = require("../game-manager");

describe("game-manager", function() {
    beforeEach(function() {
        manager.removeAllGames();
    });
    describe("#createGame", function() {
        it("shouldn't create a game with fake name", function() {
            assert.ok(!manager.createGame("0", "0", ["0", "1"], "fake-game-name", {}));
        });
        it("should create a dummy game", function() {
            assert.ok(manager.createGame("0", "0", ["0", "1"], "dummy-game", {}));
        })
        it("shouldn't create two games in the same channel", function() {
            manager.createGame("0", "0", ["0", "1"], "dummy-game", {});
            assert.ok(!manager.createGame("0", "0", ["0", "1"], "dummy-game", {}));
        });
    });
});