const express = require('express');
const app = express()
const port = 3000
const dns = require('dns');
const connectionDb = require("./config/Connection.js");
const path =require("path");
const List  = require("./models/listing.model.js");
const methodOverride = require('method-override');
const ExpressError= require("./util/ExpressError.js");
const ejsMate = require("ejs-mate");
const {listingSchema, reviewSchema }= require("./schema.js");
const Review = require("./models/review.model.js");
dns.setServers(['8.8.8.8', '8.8.4.4']);
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
connectionDb();


app.get("/", (req, res,next) => {
    try {
        res.send("this is first page");
console.log("hello");
    } catch (err) {
        next(err) ; 
    }
})

app.get("/listings",async(req,res,next)=>{
    try {
           let allList = await List.find({});
           res.render("listing/index.ejs",{allList});
    } catch (err) {
        next(err);
    }
})
app.get("/listings/new",async(req,res,next)=>{
    try {
   res.render("listing/new.ejs");
    } catch (err) {
        next(err);
        
    }
})
app.post("/listings/new",async(req,res,next)=>{
    try {
   let result =  listingSchema.validate(req.body);
   console.log(result.error);
   if(result.error){
    throw new ExpressError(400,result.error);
   }
   let newList = new List(result.value);
    // let newList =  await new List({
    //         title:title,
    //         description:description,
    //         price:price,
    //         country:country,
    //         image:image,
    //         location:location
    //     })
       await newList.save();
       console.log(newList);
       
    res.redirect("/listings");
    } catch (err) {
 next(err);
   
    }
})

app.get("/listings/:id",async (req, res,next) => {
  try {
     const { id } = req.params;
     let user =  await List.findById(id).populate("review");
     res.render("listing/view.ejs", { user });
    
  } catch (err) {
    next(err);
    
  }
   
});
app.get("/listings/:id/edit",async(req,res,next)=>{
    try {
         let {id} =req.params;
        let user = await List.findById(id);
        if(!user){
        return   res.status(404).send("user not found");
        };
              res.render("listing/edit.ejs",{ user });
    } catch (err) {
        next(err);
    }
    
})
app.put("/listings/:id/edit",async(req,res,next)=>{
    try {
    let {id} =req.params;
    let{title,description,price,location,country,image} =req.body;
    if(!title || !description || !price || !location || !country || !image) {
throw new ExpressError(400,"filed is missing");
    }

        let user = await List.findByIdAndUpdate(id,{
            title:title,
            description:description,
            price:price,
            location:location,
            country:country,
            image:image
        },  { new: true });
        if(!user){
       return    res.status(404).send("user not found");
        }
     
        console.log(user);
        res.redirect(`/listings/${id}`)
          
    } catch (err) {
     next(err);
    }
})
app.delete("/listings/:id", async (req, res,next) => {
    let { id } = req.params;

    try {
        let listing = await List.findByIdAndDelete(id);

        if (!listing) {
           return  res.status(400).send("Listing not found");
        }

        res.redirect("/listings");

    } catch (err) {
        next(err);
    }
});
app.post("/listings/:id/reviews", async(req, res,next) => {
    try {
        let {id} =req.params;
        let listing = await List.findById(id);
        console.log(listing);
        if (!listing) 
            {
          return res.status(404).send("Listing not found");
                } 
         const {error,value} = reviewSchema.validate(req.body);
         console.log(value);
         if(error){
          throw new ExpressError(400, error.message);
         }
         let {rating, comments} = value;
     
         let newReview = new Review({
            rating:rating,
            comments:comments
         })
  
      listing.review.push(newReview);
     await newReview.save();
     await listing.save();
     console.log("new review saved");
     res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
        } 
});

app.delete("/listings/:id/review/:reviewId",async(req,res,next)=>{
try {
    let {id,reviewId} = req.params;
    let reviewID = await  Review.findByIdAndDelete(reviewId);
    console.log(reviewID);
    if(!reviewID) {
     return res.status(404).send("something went wrong");
    } 
     let user  = await List.findByIdAndUpdate(id,{$pull:{review:reviewId}});
     console.log(user);
    if(!user){
        return res.status(404).send("user not found")
    }
    res.redirect(`/listings/${id}`);

} catch (err) {
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