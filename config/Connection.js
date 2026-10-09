const mongoose = require("mongoose");

const connectionDb = async()=>{
    try {
        let mongoUrl=process.env.mongoConnectionUrl;
        console.log(mongoUrl)
         await mongoose.connect(mongoUrl); 
         console.log("Database connected successfully");
    } catch (error) {
 console.log("something went wrong to connect Db",error);
    process.exit(1);
    }
}
 module.exports = connectionDb; 
