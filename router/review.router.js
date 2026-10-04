const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.model.js");
const List  = require("../models/listing.model.js");
const { reviewSchema }= require("../schema.js");
const ExpressError= require("../util/ExpressError.js");
router.post("/", async(req, res,next) => {
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
     req.flash("success","review added successfully");
     res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
        } 
});

router.delete("/:reviewId",async(req,res,next)=>{
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
    req.flash("success","review deleted successfully");
    res.redirect(`/listings/${id}`);

} catch (err) {
   next(err); 
}
})
module.exports = router;
