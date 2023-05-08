const express = require("express");
const gamesDb = require("./deta.js");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello from Space! 🚀");
});

app.post("/game", async (req, res) => {

    if (!req.body['game'])
        res.status(400).send({ success: false, message: "Bad request" });

    const response = await gamesDb.put(req.body['game']);
    console.log(response);
    res.send({ success: true, message: "Game created" })
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
