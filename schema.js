const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    image: Joi.object({
        url: Joi.string().required()
    }).required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0)
});

module.exports.reviewSchema  = Joi.object({

    rating:Joi.number().min(1).max(5),
    comments:Joi.string().required()
})
