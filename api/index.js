const express = require("express");
const { gamesDb, photoGamesDb } = require("./deta.js");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const multer = require("multer");
const bodyParser = require("body-parser");

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("Hello from Space! 🚀");
});


// ADD GAME
app.post("/game", multer().single("photo"), async (req, res) => {
    try {
        const game = JSON.parse(req.body['game']);

        const fileToUpload = req.file ?? null;

        gamesDb.put(game);

        if (fileToUpload !== null)
            photoGamesDb.put(game.key, { data: fileToUpload.buffer });

        res.status(200).send({ success: true, message: "Game created" })

    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Error creating game" })
    }

});


app.get("/games", async (req, res) => {

    /**
    * @type {Array} games
    */
    let games = [];
    const queries = {};
    if (req.query['name']) {
        queries["slug?contains"] = req.query['name'];
    }
    if (req.query['onlyGames'] && req.query['onlyGames'] !== 'false')
        queries['isExtension'] = false;
    console.log(queries)

    games = (await gamesDb.fetch(queries)).items;

    res.send(games);
});

app.get("/extensions", async (req, res) => {
    const extensions = (await gamesDb.fetch({ "isExtension": true })).items;

    res.send(extensions);
});


// GET GAME
app.get("/game/:id", async (req, res) => {

    /**
     * @type {{extensions: string[]}} game
     */
    const game = await gamesDb.get(req.params.id);

    if (!game) res.status(404).send({ success: false, message: "Game not found" });

    res.send(game);
});

// UPDATE GAME
app.put("/game", async (req, res) => {
    try {


        const game = req.body['game'];

        if (game === null) res.status(404).send(false);

        gamesDb.put(game);
        res.status(200).send(true)

    } catch (err) {
        console.log(err);
        res.status(500).send(false)
    }
});

app.post("/extensions/:gameId/:extensionId", async (req, res) => {
    const game = await gamesDb.get(req.params.gameId);
    const extension = await gamesDb.get(req.params.extensionId);

    if (!game || !extension) res.status(404).send({ success: false, message: "Game or extension not found" });

    game.extensions.push({
        key: extension.key,
        name: extension.name,
    });

    gamesDb.put(game);

    res.status(200).send({ success: true, message: "Extension added" });
});

app.delete("/game/:gameId", async (req, res) => {
    try {
        const game = await gamesDb.get(req.params.gameId);

        if (!game) res.status(404).send({ success: false, message: "Game not found" });

        await gamesDb.delete(req.params.gameId);

        res.status(200).send({ success: true, message: "Game deleted" });

    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Error deleting game" });
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
