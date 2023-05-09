const { Deta } = require("deta");
const deta = Deta();
const gamesDb = deta.Base('games');
const photoGamesDb = deta.Drive('photoGames');

module.exports = {
    gamesDb,
    photoGamesDb
};