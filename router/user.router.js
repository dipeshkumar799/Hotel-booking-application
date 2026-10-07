const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.model.js");
const { saveRedirectUrl } = require("../middleware/isloggedin.middleware.js");


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
        req.login(newUsers,(err)=>{
            if(err){
                next(err);
            }
        req.flash("success", "User registered successfully");
        res.redirect("/listings");

        })
      

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
saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),

    async(req, res) => {

        req.flash("success", "User login successfully");
       let redirect =   res.locals.redirectUrl || "/listings";
       res.redirect(redirect);
    }
);
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
});
module.exports = router;