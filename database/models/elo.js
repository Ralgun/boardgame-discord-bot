module.exports = (sequelize, DataTypes) => {
    return sequelize.define("eloTable", {
        playerId: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        channelId: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        game: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        elo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        highest_elo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        games_played: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
};