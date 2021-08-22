require('../database');
const Wrapper = require('../game-manager/game');
const {Game} = require('../games/dummy-game');
const assert = require('assert');
const userFactory = require('../user/userFactory');
const userTable = require('../database/mongoReference').getModel('user');
const gameEvents = require('../game-manager/game-events');

function createGame() {
    return new Wrapper(0, 0, 0, 1, new Game()); 
}

describe("GameWrapper", function() {
    // TODO: db shouldn't be affecting this test
    beforeEach(async function() {
        await userTable.removeByFilter({});
        await userFactory.createNewUser(0, "dummy-game", 0);
        await userFactory.createNewUser(0, "dummy-game", 1);
    });
    describe("#move", function() {
        it("shouldn't allow to skip turn", async function() {
            const game = createGame();
            const {success} = await game.move("second", 1);
            assert.ok(!success);
        });
        it ("should allow a normal move", async function() {
            const game = createGame();
            const {success} = await game.move("first", 0);
            assert.ok(success);
        });
        it ("should end the game when someone wins", function(done) {
            gameEvents.subToGameEnd(() => {
                done();
            });
            const game = createGame();
            game.move("first", 0);
        });
    });
});
