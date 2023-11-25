const express = require("express");
const { gamesDb, photoGamesDb } = require("./deta.js");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const multer = require("multer");
const bodyParser = require("body-parser");
const extensions = require("./extensions.js");

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ADD GAME
app.post("/game", multer().single("photo"), async (req, res) => {
    try {
        const game = JSON.parse(req.body['game']);

        const fileToUpload = req.file ?? null;

        gamesDb.put(game);
        // TODO qui
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

app.use("/extensions", extensions)

// GET GAME
app.get("/game/:id", async (req, res) => {

    try {
        /**
         * @type {{extensions: string[]}} game
         */
        const game = await gamesDb.get(req.params.id);

        if (!game) res.status(404).send({ success: false, message: "Game not found" });

        res.send(game);
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Error getting game" })
    }
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


// DELETE GAME
app.delete("/game/:gameId", async (req, res) => {
    try {
        const game = await gamesDb.get(req.params.gameId);
        // se il gioco è un estensione, rimuovo il riferimento dal gioco padre
        if (game.isExtension) {

            const allGames = (await gamesDb.fetch({})).items;
            allGames.forEach(async (game) => {
                if (game.extensions) {
                    const extensions = game.extensions.filter((extension) => extension.key !== req.params.gameId);
                    await gamesDb.update({ extensions: extensions }, game.key);
                }
            });
            await gamesDb.delete(req.params.gameId);
            res.status(200).send({ success: true, message: "Extension deleted" });
            return;
        }
        if (!game) res.status(404).send({ success: false, message: "Game not found" });

        if (game.hasExtensions && game.extensions.length > 0) {
            const extensionsToDelete = game.extensions ?? [];

            // Deletion of game and extensions
            extensionsToDelete.forEach(async (extension) => {
                console.log(extension);
                await gamesDb.delete(extension.key);
            });

        }

        await gamesDb.delete(req.params.gameId);

        res.status(200).send({ success: true, message: "Game deleted" });

    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Error deleting game" });
    }
});


// LISTEN AND SERVE API
app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
