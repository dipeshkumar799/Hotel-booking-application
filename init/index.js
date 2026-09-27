const mongoose = require("mongoose");
const List =require("../models/listing.model.js");
const { sampleListings } = require("./data.js");
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectionDb = async()=>{
    try {
         await mongoose.connect(`mongodb+srv://dbDipesh:cRNBrRr1ITO8psBM@cluster0.hvzmdlf.mongodb.net/Airnbnb?appName=Cluster0`); 
         console.log("Database connected successfully");
    } catch (error) {
 console.log("something went wrong to connect Db",error);
    process.exit(1);
    }
}
connectionDb();
async  function initData(){
    try {
           let user  = await List.deleteMany({});
           console.log("user deleted successfull",user);
           let initData = await List.insertMany(sampleListings);
           console.log("data inserted succesfully",initData);
           
    } catch (error) {
        console.log("faild to delete and insert",error);
        
    }
     
 }
 initData();

