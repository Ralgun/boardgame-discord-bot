const cont = {};

function getBoardEmbed(playerIdToMove, board, gameMessage) {
    return {
        color: 0x0099ff,
        title: `Game`,
        fields: [
            {
                name: 'Player to move',
                value: `<@${playerIdToMove}>`,
            },
            {
                name: 'Game message',
                value: gameMessage || "No message",
            }
        ],
        description: board,
        timestamp: new Date(),
    };
}

cont.getBoardEmbed = getBoardEmbed;
module.exports = cont;