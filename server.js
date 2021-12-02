// Require Dependencies
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const methodOverride = require("method-override");
const linksController = require("./controllers/links");

// Initialize app
const app = express();

// Configure Settings
require("dotenv").config();

// Database connection
mongoose.connect(process.env.DATABASE_URL);

// Database Connection Error/Success
const db = mongoose.connection;
db.on("error", (err) => console.log(err.message));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use(methodOverride("_method"));

//Routes / Controllers (middleware)
app.use("/", linksController);

// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));