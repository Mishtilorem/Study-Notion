const mongoose = require("mongoose")
require("dotenv").config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=> console.log("DB connected Successfully"))
    .catch((err) =>{
        console.log("The error is" ,err)
        process.exit(1)
    })
}