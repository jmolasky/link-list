// Require Dependencies
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const session = require("express-session");
const methodOverride = require("method-override");
const linksController = require("./controllers/links");
const usersController = require("./controllers/users");

// Initialize app
const app = express();

// Configure Settings
require("dotenv").config();

const { DATABASE_URL, PORT, SECRET } = process.env;

// Database connection
mongoose.connect(DATABASE_URL);

// Database Connection Error/Success
const db = mongoose.connection;
db.on("error", (err) => console.log(err.message));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    })
);

app.use(async function(req, res, next) {
    if(req.session && req.session.user) {
        const user = await require("./models/user").findById(req.session.user);
        res.locals.user = user;
    } else {
        res.locals.user = null;
    }
    next();
});

app.use(express.static("public"));
app.use(methodOverride("_method"));

//Routes / Controllers (middleware)
app.use("/", usersController);
app.use("/", linksController);

// Listener
app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));