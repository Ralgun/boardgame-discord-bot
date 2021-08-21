const { doesNotMatch } = require('assert');
require('../database/index');
const assert = require('assert');
const userTable = require('../database/mongoReference').getModel('user');
const userFactory = require('../user/userFactory');

describe('userFactory', function () {
    beforeEach(async function() {
        // Reset the database
        await userTable.removeByFilter({});
    });
    describe('#createUser', function () {
        it("should create a new user", async function() {
            const user = await userFactory.createNewUser('1', 'game', '1');
            assert.ok(user);
        });
        it("should throw an error after adding the same player twice", async function() {
            userFactory.createNewUser('1', 'game', '1');
            await assert.rejects(userFactory.createNewUser('1', 'game', '1'));
        });
        it("shouldn't throw an error after adding the same player twice but in different games",
            async function() {
            await userFactory.createNewUser('1', 'game0', '1');
            await userFactory.createNewUser('1', 'game1', '1');
        });
        it("shouldn't throw an error after adding the same player twice but in different servers",
            async function() {
            await userFactory.createNewUser('1', 'game', '1');
            await userFactory.createNewUser('2', 'game', '1');
        });
    });
    describe("#getOneUser", function() {
        it("should return the correct user", async function() {
            const original = await userFactory.createNewUser("1", "game", "1");
            const user = await userFactory.getOneUser("1", "game", "1");
            assert.deepStrictEqual(user, original);
        });
    });
});