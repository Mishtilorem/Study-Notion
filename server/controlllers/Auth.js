// send OTP
const User = require("../models/User")
const OTP  = require("../models/OTP")
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt")
const mailSender = require("../utils/mailSender");
const {passwordUpdate,emailVerificationTemplate} = require("../mail/templates/emailVerificationTemplate")

const Profile = require("../models/Profile")
const jwt = require("jsonwebtoken")
require("dotenv").config()
exports.sendOTP = async(req,res) =>{
    // fetch email
    try{
    const{email} = req.body;
    // check if user exist
    const checkUserPresent = await User.findOne({email})
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"User already exist",
        })
    }
// generate otp
var otp = otpGenerator.generate(6,{
    upperCaseAlphabets:false,
    lowerCaseAlphabets:false,
    specialChars:false
});
// check unique otp or not 
const result = await OTP.findOne({otp:otp});
while(result){
    otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
}
    )
}
// otp entry in databse.
const otpPayload = {email,otp};
const otpBody = await OTP.create(otpPayload);
try {
  const emailResponse = await mailSender(
    
    emailVerificationTemplate(otp) 
  )
  console.log("OTP Email sent:", emailResponse.response || "Sent")
} catch (emailErr) {
  console.error("Failed to send OTP email:", emailErr)
  return res.status(500).json({
    success: false,
    message: "Failed to send OTP email",
  })
}
res.status(200).json({
    success:true,
    message:"sent success",
    otp
})
}

catch(err){
return res.status(500).json({
    success:false,
    message:"failed"
})
}
}


// signup

exports.signUp = async (req,res) => {

    try{
        // data fetch
        const {firstName, lastName, email, password,confirmPassword, accountType, otp} =req.body
        // validate kro
        if(!firstName || !lastName || !password || !confirmPassword || !email || !accountType){
            return res.status(403).json({
                success: false, 
                message:"Fill all details"
            })
        }
        
       // password match
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm Password doesn't match"
            })
        }
        if(!otp){
            return res.status(400).json({
                success:false,
                message:"otp doesn't match"
            })
        }
        console.log(req.body.email)
        // user exists or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({

                success: false,
                message: "User is already registred."
            })
        }
        // findmost recent otp for user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp)
        // validate otp
        if(recentOtp.length==0){
            return res.status(400).json({
                
                success:false,
                message: "OTP not found",
            })
        }
        else if(otp!== recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message: "Invalid OTP",
            })
        }
        // password hash
        const hashedPassword = await bcrypt.hash(password,10);
        let approved="";
        approved==="Instructor"?(approved =false) :(approved=true);

        // entry in db.
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber:null,
        })
        const user= await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType:accountType,
            approved:approved,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        return res.status(200).json({  
            success:true,
            message: 'User created/registered',
           
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"User cannot be registered."
        })
    }
}

exports.login = async(req,res) =>{
    
    try{
        // fetch data
        const {email,password} =req.body
        // validate data
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message:"Fill all details"
            })
        }
        // user check exist
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user not exist"
            })
        }
        
        // password match, jwt token,
        if(await bcrypt.compare(password,user.password)){
            const payload  = {
                email:user.email,
                id: user._id,
                accountType: user.accountType
            }
             // create cookie and send response
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            })
            user.token = token
           user.password=undefined;
            const options = {
                expires: new Date(Date.now()+ 3
            *24*60*60*1000),
            httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,user,
                message:'Logged in successfully'
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password incorrect"
            })
        }
       
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            err:err.message,
            success:false,
            message:"User can't be login"
        })
    }
}


// change password

exports.changePassword =async(req,res) =>{
    // fetch data
//     const { oldPassword, newPassword, confirmPassword, email } = req.body;

//     try {
//         // 1. Validate inputs
//         // if (!oldPassword || !newPassword || !confirmPassword) {
//         //     return res.status(403).json({ message: 'All fields are required.' });
//         // }
//         // // password check
//         // if (newPassword !== confirmPassword) {
//         //     return res.status(401).json({ message: 'New password and confirm password do not match.' });
//         // }
//         // find user
//         const checkUser = await User.findOne({email})
//         if(!checkUser){
//             return res.status(404).json({ message: 'User not found.' });
//         }
//          // 3. Verify old password
//          const isMatch = await bcrypt.compare(oldPassword, checkUser.password);
//          if (!isMatch) {
//              return res.status(400).json({ message: 'Old password is incorrect.' });
//          }
 
//          // 4. Hash the new password
//          const hashedPassword = await bcrypt.hash(newPassword, 10);
 
//          // 5. Update password in the database
//          checkUser.password = hashedPassword;
//          await checkUser.save();
//          try {
//             const emailResponse = await mailSender(
//               checkUser.email,
//               "Password for your account has been updated",
//               passwordUpdate(
//                 checkUser.email,
//                 `Password updated successfully for ${checkUser.firstName} ${checkUser.lastName}`
//               )
//             )
//             console.log("Email sent successfully:", emailResponse)
//           } catch (error) {
//             // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
//             console.error("Error occurred while sending email:", error)
//             return res.status(500).json({
//               success: false,
//               message: "Error occurred while sending email",
//               error: error.message,
//             })
//           }
//         // const mailResponse = await mailSender(email,"Change Pasword","Your password has been changed")
//         // if (!mailResponse) {
//         //     return res.status(500).json({ message: 'Failed to send email notification.' });
//         // }
//         return res.status(200).json({ success: true,message: 'Password updated successfully.' });
// }

// catch(err){
//     return res.status(500).json({success: false, message: 'Internal server error.',err: err.message,});
// }
try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )
    console.log(updatedUserDetails,"rfnawulgnwU")
    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdate(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }

}

