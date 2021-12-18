// Require dependencies
const express = require("express");
const linksRouter = express.Router();
const mongoose = require("mongoose");
const Link = require("../models/link");
const Tag = require("../models/tag");

const axios = require("axios");
require("dotenv").config();
const BASE_URL = "https://api.linkpreview.net/";
const API_KEY = process.env.API_KEY;

// Routes / Controllers

// Search Route
linksRouter.post("/search", async (req, res) => {
    if(res.locals.user === null) {
        res.redirect("/login");
    } else {
        const tags = await Tag.find({ user: res.locals.user });
        const term = req.body.term;
        let links = await Link.find({ title: { $regex: term }}).populate("tags", "name");
        if(links.length === 0) {
            links = "No Results";
        }
        res.render("index.ejs", { links, tags, navBrand: "Search Results"});
    }
});

// Filter Route
linksRouter.post("/filter", async (req, res) => {
    if(res.locals.user === null) {
        res.redirect("/login");
    } else {
        const tags = await Tag.find({ user: res.locals.user });
        let tag = await Tag
            .findOne({ user: mongoose.Types.ObjectId( res.locals.user ), name: req.body.tag })
            .populate({
                path: "links",
                populate: {
                    path: "tags",
                    // only returns the name field of the tag document, excluding the _id
                    select: "name -_id"
                }
            });
        let links = tag.links;
        res.render("index.ejs", { links, tags, navBrand: "links"});
    }
});

// seed route
linksRouter.get("/seed", async (req, res) => {
    if(res.locals.user === null) {
        res.redirect("/login");
    } else {
        const data = [
            {
                title: "KMFDM 97 GERMANY",
                url: "https://www.youtube.com/watch?v=Sp9Pvb2ulbQ",
                user_id: res.locals.user._id,
                website: "YouTube",
                description: "ViVA show",
                private: false,
            },
            {
                title: ".filter() jQuery API documentation",
                url: "https://api.jquery.com/filter/",
                user_id: res.locals.user._id,
                private: false,
            },
        ];
        await Link.deleteMany({});
        await Tag.deleteMany({});
        await Link.create(data);
        res.redirect("/");
    }
});

// Index
linksRouter.get("/", async (req, res) => {
    // store categories in database?
    if(res.locals.user === null) {
        res.redirect("/login");
    } else {
        const id = req.session.user;
        // find all tags on the database 
        const tags = await Tag.find({ user: id });
        // find only links belonging to the user
        const links = await Link.find({ user_id: id }).populate("tags", "name");
        res.render("index.ejs", { links, tags, navBrand: "Links" });
    }
});

// New
linksRouter.get("/new", (req, res) => {
    if(res.locals.user === null) {
        res.redirect("/login");
    } else {
        res.render("new.ejs", { navBrand: "Add a Link" });
    }
});

// Delete
linksRouter.delete("/:id", async (req, res) => {
    if(res.locals.user === null) {
        res.redirect("/login");
    } else {
        // delete link from database and return a copy of deleted link with tags field populated
        const link = await Link.findByIdAndDelete(req.params.id).populate("tags");
        // iterate through each tag of the deleted link
        link.tags.forEach(async function(tag) {
            if(tag.links.length > 1) {
                // remove only reference to link from tag on database
                await Tag.findByIdAndUpdate(tag._id, { $pull: { links: link._id } }, { new: true });
            } else {
                // remove the entire tag on the database
                await Tag.findByIdAndDelete(tag._id);
            }
        });
        res.redirect("/");
    }
});

// Update
linksRouter.put("/:id", async (req, res) => {
    req.body.private = !!req.body.private;
    //req.body.user_id = res.locals.user._id;
    if(req.body.description === '') {
        req.body.description = null;
    }
    if(req.body.website === '') {
        req.body.website = null;
    }
    if(!req.body.url.includes("youtube.com")) {
        const url = req.body.url;
        await axios.get(`${BASE_URL}?key=${API_KEY}&q=${url}`).then(response => {
            req.body.img = response.data.image;
        });
    }
    await Link.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect("/");
});

// Create

// helper functions for tags functionality
async function addLink(linkData) {
    const link = await Link.create(linkData);
    return link;
}

async function addTag(tagData, userId) {
    const tag = await Tag.create({ name: tagData, user: userId });
    return tag;
}

async function addTagToLink(linkId, tag) {
    await Link.findByIdAndUpdate(linkId, { $push: { tags: tag._id } }, { new: true });
    return;
}

async function addLinkToTag(tagId, link) {
    await Tag.findByIdAndUpdate(tagId, { $push: { links: link._id } }, { new: true });
    return;
}

// Create route
linksRouter.post("/", async (req, res) => {
    
    const url = req.body.url;
    const userId = req.session.user;
    // call the linkpreview.net API to get image for site preview to add to database
    if(!req.body.url.includes("youtube.com")) {
        await axios.get(`${BASE_URL}?key=${API_KEY}&q=${url}`).then(response => {
            req.body.img = response.data.image;
        });
    }

    // set private to true or false
    req.body.private = !!req.body.private;
    // insert user's id into link 
    req.body.user_id = userId;

    if(req.body.description === '') {
        delete req.body.description;
    }

    if(req.body.website === '') {
        delete req.body.website;
    }

    // create an array of tags based on the tags property of req.body
    let tagArray = [];
    if(req.body.tags !== '') {
        tagArray = req.body.tags.split(",");
    }
    // delete the tags property from req.body
    delete req.body.tags;

    // create link on database (without tags)
    const link = await addLink(req.body);

    // if there is a tag array
    if(tagArray.length > 0) {
        // iterate over tags in array
        tagArray.forEach(async function(tag) {
            // check the database to make sure tag isn't a duplicate
            const duplicateTag = await Tag.find({ user: mongoose.Types.ObjectId( userId ), name: tag });
            // if the tag isn't a duplicate
            if(duplicateTag.length === 0) {
                // add tag to the database
                const databaseTag = await addTag(tag, req.session.user);
                // add tag's id to the link on the database
                await addTagToLink(link._id, databaseTag);
                // add link's id to the tag on the database
                await addLinkToTag(databaseTag._id, link);
            // if the tag is a duplicate
            } else {
                // add the duplicate tag's id to the link
                await addTagToLink(link._id, duplicateTag[0]);
                // add the link's id to the tag already on the database
                await addLinkToTag(duplicateTag[0]._id, link);
            }
        });
    }
    res.redirect("/");
});

// Edit
linksRouter.get("/:id/edit", (req, res) => {
    if(res.locals.user === null) {
        res.redirect("/login");
    } else {
        Link.findById(req.params.id, (err, link) => {
            res.render("edit.ejs", { link, navBrand: "Edit Link" });
        });
    }
});

module.exports = linksRouter;