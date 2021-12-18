const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

usersRouter.get("/login", (req, res) => {
    res.render("login.ejs", { err: '', navBrand: "Log In"});
});

usersRouter.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, "+password", (err, foundUser) => {
        if(!foundUser) return res.render("login.ejs", { err: "invalid credentials", navBrand: "Log In"});
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

usersRouter.post("/signup", async (req, res) => {
    // if there is an email and a password
    if(req.body.password !== '' && req.body.email !== '') {
        const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(SALT_ROUNDS));
        req.body.password = hash;
        try {
            const user = await User.create(req.body);
            req.session.user = user._id;
            res.redirect("/");
        } catch(err) {
            // if the email is taken
            if(err.name === "ValidationError") {
                const errorMessage = err.errors.email.message;
                console.log(errorMessage);
                res.render("signup.ejs", { navBrand: "Sign Up", error: "Email is taken"});
            } else {
                res.redirect("/signup");
            }
        }

    } else {
        res.redirect("/signup");
    }
});

usersRouter.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// Update email or password

// Update
usersRouter.put("/dashboard", async (req, res) => {
    if(req.body.email === '') {
        delete req.body.email;
    }
    if(req.body.password === '') {
        delete req.body.password;
    } else {
        const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(SALT_ROUNDS));
        req.body.password = hash;
    }
    await User.findByIdAndUpdate(req.session.user, req.body, { new: true});
    res.redirect("/dashboard");
});

// Edit
usersRouter.get("/dashboard", async (req, res) => {
    if(res.locals.user === null) {
        res.redirect("/login");
    } else {
        const user = await User.findById(req.session.user);
        res.render("dashboard.ejs", { user, navBrand: "Dashboard" });
    }
});

module.exports = usersRouter;