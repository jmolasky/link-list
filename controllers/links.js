// Require dependencies
const express = require("express");
const linksRouter = express.Router();
const Link = require("../models/link");

// Routes / Controllers

// seed route

linksRouter.get("/seed", async (req, res) => {
    const data = [
        {
            title: "FULL MATCH | Arsenal v Newcastle | Emirates FA Cup Third Round 2020-21",
            url: "https://www.youtube.com/watch?v=vKcOGmfTwqY",
            description: "Super-sub Emile Smith Rowe was the difference as he scored late in extra-time to help Arsenal beat Newcastle United, as Pierre-Emerick Aubameyang's goal sealed the Gunners spot in the Fourth Round of the Emirates FA Cup.",
            private: false,
        },
    ];
    await Link.deleteMany({});
    await Link.create(data);
    res.redirect("/");
});

//