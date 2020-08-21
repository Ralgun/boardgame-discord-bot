const Elo = require('elo-calculator');

const elo = new Elo({
    // The rating of which each initialized player will start with
    rating: 1500,
    // The coefficient, called the K-factor, is the maximum possible adjustment per game.
    // Which value is used depends on one or more the following points:
    // 1. The number of games the player has played
    // 2. The current rating of the player
    // 3. The highest rating the player has ever had.
    // Weak and new players generally have a higher coefficient than stronger, more experienced players.
    // The conditions used to apply a k-factor are based the ones used by the World Chess Federation (http://www.fide.com/fide/handbook.html?id=172&view=article)
    k: [40, 20, 10]
  });

const cont = {};

function calculateElo(p1Rating, p1GamesPlayed, p1HighestRating, p2Rating, p2GamesPlayed, p2HighestRating, winNotation) {
    const player1 = elo.createPlayer(p1Rating, p1GamesPlayed, p1HighestRating);
    const player2 = elo.createPlayer(p2Rating, p2GamesPlayed, p2HighestRating);

    elo.updateRatings([[player1, player2, winNotation]]);

    return [Math.round(player1.rating), Math.round(player2.rating)];

    elo.players = [];
}

cont.calculateElo = calculateElo;

module.exports = cont;