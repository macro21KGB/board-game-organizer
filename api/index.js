const express = require("express");
const gamesDb = require("./deta.js");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello from Space! 🚀");
});


app.post("/game", async (req, res) => {
    console.log(req.body);
    if (!req.body['game'])
        res.status(400).send({ success: false, message: "Bad request" });

    await gamesDb.put(req.body['game']);
    res.status(200).send({ success: true, message: "Game created" })
});


app.get("/games", async (req, res) => {
    if (req.query['name']) {
        console.log(req.query['name']);
        const games = await gamesDb.fetch({ "slug?contains": req.query['name'] });
        res.send(games);
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
