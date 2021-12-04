// Require dependencies
const express = require("express");
const linksRouter = express.Router();
const Link = require("../models/link");

// Routes / Controllers

// seed route

linksRouter.get("/seed", async (req, res) => {
    const data = [
        {
            title: "KMFDM 97 GERMANY",
            url: "https://www.youtube.com/watch?v=Sp9Pvb2ulbQ",
            website: "YouTube",
            description: "ViVA show",
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
    // store categories in database?
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

// Update
linksRouter.put("/:id", (req, res) => {
    req.body.private = !!req.body.private;
    if(req.body.description === '') {
        delete req.body.description;
    }
    Link.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, link) => {
        res.redirect(`/${req.params.id}`);
    });
});

// Create
linksRouter.post("/", (req, res) => {
    // call the linkpreview.net API here to get image for site preview to add to database
    req.body.private = !!req.body.private;
    if(req.body.description === '') {
        delete req.body.description;
    }
    Link.create(req.body, (error, link) => {
        res.redirect("/");
    });
});

// Edit
linksRouter.get("/:id/edit", (req, res) => {
    Link.findById(req.params.id, (err, link) => {
        res.render("edit.ejs", { link });
    });
});

// Show
linksRouter.get("/:id", (req, res) => {
    Link.findById(req.params.id, (err, link) => {
        res.render("show.ejs", { link });
    });
});


module.exports = linksRouter;