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
            website: "YouTube",
            description: "Super-sub Emile Smith Rowe was the difference as he scored late in extra-time to help Arsenal beat Newcastle United, as Pierre-Emerick Aubameyang's goal sealed the Gunners spot in the Fourth Round of the Emirates FA Cup.",
            private: false,
        },
        {
            title: ".filter() jQuery API documentation",
            url: "https://api.jquery.com/filter/",
            private: false,
        },
    ];
    await Link.deleteMany({});
    await Link.create(data);
    res.redirect("/");
});

// Index
linksRouter.get("/", (req, res) => {
    Link.find({}, (err, links) => {
        res.render("index.ejs", { links });
    });
});

// New
linksRouter.get("/new", (req, res) => {
    res.render("new.ejs");
});

// Delete
linksRouter.delete("/:id", (req, res) => {
    Link.findByIdAndDelete(req.params.id, (err, link) => {
        res.redirect("/");
    });
});

// Create
linksRouter.post("/", (req, res) => {
    req.body.private = !!req.body.private;
    if(req.body.description === '') {
        delete req.body.description;
    }
    Link.create(req.body, (error, link) => {
        res.redirect("/");
    });
});

// Show
linksRouter.get("/:id", (req, res) => {
    Link.findById(req.params.id, (err, link) => {
        res.render("show.ejs", { link });
    });
});


module.exports = linksRouter;