const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    description:{
        type: String,
        maxlength: 100,
    },
    course:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }]
})

module.exports = mongoose.model("Category",categorySchema)