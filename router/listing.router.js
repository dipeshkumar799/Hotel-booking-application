const express = require('express');
const router = express.Router({ mergeParams: true });
const List  = require("../models/listing.model.js");
const {listingSchema, reviewSchema }= require("../schema.js");
const ExpressError= require("../util/ExpressError.js");
const { isLoggedIn } = require("../middleware/isloggedin.middleware.js");
const {storage} =require("../cloudinaryConfing.js");
const multer  = require('multer')
const upload = multer({ storage});
router.get("/",async(req,res,next)=>{
    try {
           let allList = await List.find({});
           res.render("listing/index.ejs",{allList});
    } catch (err) {
        next(err);
        
    }
})

router.get("/new",isLoggedIn ,async(req,res,next)=>{
    try {
       res.render("listing/new.ejs");
    } catch (err) {
        next(err);
    }
})

router.post("/new",isLoggedIn,upload.single("image[url]"),async(req,res,next)=>{
    // try {
    res.send(req.file);       
//    let result =  listingSchema.validate(req.body);
//    console.log(result);
//    console.log(result.error);
//    if(result.error){
//     throw new ExpressError(400,result.error);
//    }
//    let newList = new List(result.value);
//         newList.owner = req.user;
//     // let newList =  await new List({
//     //         title:title,
//     //         description:description,
//     //         price:price,
//     //         country:country,
//     //         image:image,
//     //         location:location
//     //     })
//        await newList.save();
//        console.log(newList);
//          req.flash('success', 'new listing existed successfull')
       
//     res.redirect("/listings");
//     } catch (err) {
//  next(err);
   
//     }
});

router.get("/:id",async (req, res,next) => {
  try {
     const { id } = req.params;
     let user =  await List.findById(id).populate("review").populate("owner");
     console.log(user);
     res.render("listing/view.ejs", { user });
    
  } catch (err) {
    next(err);
    
  }
   
});
router.get("/:id/edit",isLoggedIn,async(req,res,next)=>{
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
router.put("/:id/edit",isLoggedIn,async(req,res,next)=>{
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
         req.flash('success', 'list edited successfull')
        res.redirect(`/listings/${id}`)
          
    } catch (err) {
     next(err);
    }
})

router.delete("/:id",isLoggedIn,async (req, res,next) => {
    let { id } = req.params;

    try {
        let listing = await List.findByIdAndDelete(id);

        if (!listing) {
           return  res.status(400).send("Listing not found");
        }
         req.flash('success', 'list deleted successfull')

        res.redirect("/listings");

    } catch (err) {
        next(err);
    }
});
module.exports = router;