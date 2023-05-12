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

app.get("/photo/:key", async (req, res) => {
    const photo = await photoGamesDb.get(req.params.key);
    if (!photo) res.status(404).send({ success: false, message: "Photo not found" });

    const buffer = await img.arrayBuffer();
    res.send(Buffer.from(buffer));

});

app.get("/games", async (req, res) => {

    /**
    * @type {Array} games
    */
    let games = [];

    if (req.query['name']) {
        console.log(req.query['name']);
        games = (await gamesDb.fetch({ "slug?contains": req.query['name'] })).items;
    }
    else {
        games = (await gamesDb.fetch()).items;
    }

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

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
