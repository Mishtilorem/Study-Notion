const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const crypto = require("crypto")
const bcrypt = require("bcrypt")

exports.resetPasswordToken = async(req,res) =>{
    try{
        // get email from req body,
    const email=req.body.email
    // check user for this email
    const user = await User.findOne({email:email})
    if(!user){
        return res.json({
           
            success:false,
            message:'your email is not present'
        })
    }
 // token create(each user one token and same everytime unique for one and expiry time)
 const token = crypto.randomBytes(20).toString("hex")
// update user by adding token and expiration time
const updatedDetails = await User.findOneAndUpdate({email:email},{
    token:token,
    resetPasswordExpires: Date.now() + 3600000
},{new:true});
    // send mail,create url
    const url = `http://localhost:3000/update-password/${token}`
    // token isliye ki har ek user ki alg alg link ho.
await mailSender(email,
    "Password Reset Link",
    `Your Link for email verification is ${url}. Please click this url to reset your password.`)

console.log("it is", url)
return res.status(200).json({
    success:true,
    message:"Email sent successfully,please check and change password."
})
}
catch(err){
return res.status(500).json({
    err:err.message
    ,
    success: false,
    message:'something went wRong'
})
}
    }

//reset password

exports.resetPassword = async (req,res) =>{
    //data fetch
    try{
    const {password,confirmPassword,token} = req.body
    if(password!==confirmPassword){
        return res.json({
            success:false,
            message:'Password not matching'
        })
    }
    // validation
    // get userdetails from db using token
    const userDetails = await User.findOne({token:token});
    // if no entry - invalid token
    if(!userDetails){
        return res.json({
            success:false,
            message:'Token is invalid'
        })
    }
    // token time expire.
    if (userDetails.resetPasswordExpires < Date.now()) {
        return res.status(400).json({
            success: false,
            message: 'Token has expired, please regenerate your token'
        });
    }
    // hash password.
    const hashPassword = await bcrypt.hash(password,10)
    // update password.
    await User.findOneAndUpdate(
        {token:token},
        {password:hashPassword},
        {new:true},
    )
    return res.status(200).json({
        success:true,
        message:'Password reset successful'
    })

}
catch(err){
    

    return res.status(400).json({
        
        success:false,
        message:'Somthing went wRong',
        err:err.message
    })
}
}
// token ki help se user wo wala token ki helpse find krna h

    