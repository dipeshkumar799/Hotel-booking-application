const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.model.js");


// ================= SIGNUP PAGE =================

router.get("/signup", (req, res, next) => {
    try {
        res.render("userAuth/userReg.ejs");
    } catch (err) {
        next(err);
    }
});


// ================= SIGNUP =================

router.post("/signup", async (req, res, next) => {
    try {

        const { username, email, password } = req.body;

        const newUser = new User({
            username: username,
            email: email
        });

        const newUsers = await User.register(newUser, password);

        console.log(newUsers);

        req.flash("success", "User registered successfully");

        res.redirect("/login");

    } catch (err) {

        req.flash("error", err.message);

        res.redirect("/signup");
    }
});


// ================= LOGIN PAGE =================

router.get("/login", (req, res, next) => {
    try {
        res.render("userAuth/loginPage.ejs");
    } catch (err) {
        next(err);
    }
});


// ================= LOGIN =================

router.post(
    "/login",

    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),

    async(req, res) => {

        req.flash("success", "User login successfully");

        res.send("logged in successfull");
    }
);


module.exports = router;