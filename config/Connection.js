const mongoose = require("mongoose");

const connectionDb = async()=>{
    try {
         await mongoose.connect(`mongodb+srv://dbDipesh:cRNBrRr1ITO8psBM@cluster0.hvzmdlf.mongodb.net/Airnbnb?appName=Cluster0`); 
         console.log("Database connected successfully");
    } catch (error) {
 console.log("something went wrong to connect Db",error);
    process.exit(1);
    }
}
 module.exports = connectionDb; 
