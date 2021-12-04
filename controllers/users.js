const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

usersRouter.get("/login", (req, res) => {
    res.render("login.ejs", { err: '', navBrand: "Log In"});
});

usersRouter.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, "+password", (err, foundUser) => {
        if(!foundUser) return res.render("login.ejs", { err: "invalid credentials"});
        if(!bcrypt.compareSync(req.body.password, foundUser.password)) {
            return res.render("login.ejs", { err: "invalid credentials", navBrand: "Log In"});
        }
        req.session.user = foundUser._id;
        res.redirect("/");
    });
});

usersRouter.get("/signup", (req, res) => {
    res.render("signup.ejs", { navBrand: "Sign Up"});
});

usersRouter.post("/signup", (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(SALT_ROUNDS));
    req.body.password = hash;
    User.create(req.body, (err, user) => {
        req.session.user = user._id;
        res.redirect("/");
    });
});

usersRouter.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = usersRouter;