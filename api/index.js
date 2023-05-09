const express = require("express");
const { gamesDb, photoGamesDb } = require("./deta.js");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("Hello from Space! 🚀");
});


// ADD GAME
app.post("/game", async (req, res) => {
    console.log(req.body);
    if (!req.body['game'])
        res.status(400).send({ success: false, message: "Bad request" });

    const currentGame = req.body['game'];

    await gamesDb.put(currentGame);
    res.status(200).send({ success: true, message: "Game created" })
});

// ADD PHOTO GAME
app.post("/game/photo", async (req, res) => {

    if (!req.body || !req.query['key']) {
        res.status(400).send({ success: false, message: "Bad request" });
    }

    const photoBlob = req.body;
    const key = req.query['key'];

    await photoGamesDb.put(key, { data: photoBlob });
    res.status(200).send({ success: true, message: "Game updated" })
});


app.get("/games", async (req, res) => {
    if (req.query['name']) {
        console.log(req.query['name']);

        /**
         * @type {Array}
         */
        const games = await gamesDb.fetch({ "slug?contains": req.query['name'] });

        games.map(async (game) => {
            const imageUrl = await photoGamesDb.get(game.key);
            game.imageUrl = imageUrl;
        })

        res.status(200).send(games);
        return;
    }

    const games = await gamesDb.fetch();
    res.send(games);
});

app.get("/game/:id", async (req, res) => {
    const game = await gamesDb.get(req.params.id);
    res.send(game);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
