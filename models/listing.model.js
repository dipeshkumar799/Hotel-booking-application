const mongoose = require("mongoose");
const Review = require("./review.model");
const listSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 60,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
   image: {
    filename: {
        type: String,
        default: "listingimage"
    },
    url: {
        type: String,
        required: true
    }
},
   price: {
    type: Number,
    required: true,
    min: 0,
    default: 0
},
    location: {
        type: String,
        required: true,
        default:"na",
        trim: true
    },
       country: {
        type: String,
        trim: true
        
    },
    review:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }]
});
listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.review}});
    }
})

const List = mongoose.model("List", listSchema);

module.exports = List;
