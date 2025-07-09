const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")
const OTPSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
    },
    otp:{
        type: String,
        required: true,

    },
    createdAt:{
        type:Date,
        default: Date.now(),
        expires: 5*60
    }
})
// OTP JO SEND ho rhi wo schema k baad model k phle,
// pre middleware before db entry .
// a function to send mail.
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Code", otp)
        console.log("email sent successfully")
    }
    catch(err){
        console.log("error is", err)
        throw err
    }
}
OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp)
})

module.exports = mongoose.model("OTP",OTPSchema)