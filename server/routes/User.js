const express = require("express")
const router =express.Router()


const {login, signUp, sendOTP, changePassword} = require("../controlllers/Auth")
const { auth } = require("../middlewares/Auth")
const { resetPassword, resetPasswordToken } = require("../controlllers/ResetPassword")
// route for user login
router.post("/login",login)
// route for user signup
router.post("/signup",signUp)

// route for sending otp
router.post("/sendotp",sendOTP)

// route for changing the password
router.post("/changepassword",auth,changePassword)
 

// route for reset password

router.post("/reset-password",resetPassword)
router.post("/reset-password-token",resetPasswordToken)

module.exports = router