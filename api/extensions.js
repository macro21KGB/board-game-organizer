const express = require("express");
const router = express.Router();
const { gamesDb } = require("./deta.js");


router.get("/", async (req, res) => {
    const extensions = (await gamesDb.fetch({ "isExtension": true })).items;

    res.send(extensions);
});

// GET ALL EXTENSIONS FOR GAME
router.get("/:gameId", async (req, res) => {
    const game = await gamesDb.get(req.params.gameId);

    if (!game) res.status(404).send({ success: false, message: "Game not found" });

    res.send(game.extensions);
});

router.post("/:gameId/:extensionId", async (req, res) => {
    const game = await gamesDb.get(req.params.gameId);
    const extension = await gamesDb.get(req.params.extensionId);

    if (!game || !extension) res.status(404).send({ success: false, message: "Game or extension not found" });

    game.extensions.push({
        key: extension.key,
        name: extension.name,
        parentKey: game.key,
    });
    console.log(game.extensions);
    gamesDb.put(game);

    res.status(200).send({ success: true, message: "Extension added" });
});

module.exports = router;