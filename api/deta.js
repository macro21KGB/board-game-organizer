const { Deta } = require("deta");
const deta = Deta();
const gamesDb = deta.Base('games');

module.exports = gamesDb;