const express = require('express');
const app = express()
const port = 3000
const dns = require('dns');
const connectionDb = require("./config/Connection.js");
const path =require("path");
const List  = require("./models/listing.model.js");
const User = require("./models/user.model.js");
const LocalStrategy = require("passport-local");
const methodOverride = require('method-override');
const ExpressError= require("./util/ExpressError.js");
const ejsMate = require("ejs-mate");
const flash = require('connect-flash');
const Review = require("./models/review.model.js");
const listing = require("./router/listing.router.js");
const reviews = require("./router/review.router.js")
const cookieParser = require('cookie-parser')
const session = require("express-session");
const passport = require("passport");
dns.setServers(['8.8.8.8', '8.8.4.4']);
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
connectionDb();
const sessionOption= {
    secret:"thiismysecretekey",
    resave:false,
    saveUninitialized: false,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
};
app.use(session(sessionOption));//for session and expiry
app.use(flash());//give or print after redirect
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.message = req.flash("success");
    res.locals.errorMessag=req.flash("error");
    next();
})

app.get("/", (req, res,next) => {
    try {
        res.redirect("/listings");
console.log("hello");
    } catch (err) {
        next(err) ; 
    }
})

app.use("/listings",listing);
app.use("/listings/:id/reviews",reviews);

app.get("/user/login",async(req,res,next)=>{
try {
    res.render("userAuth/loginPage.ejs");

}
 catch (err) {
next(err);    
}
})

app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})
app.use((err,req,res,next)=>{
let  { statusCode=500 , message="some error occur"}=  err;
//   res.status(statusCode).send(message);
res.render("listing/error.ejs",{ err });
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});