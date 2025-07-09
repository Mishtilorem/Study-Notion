const express = require("express")
const router = express.Router()

const{auth, isStudent} = require("../middlewares/Auth")
const {capturePayment,sendPaymentSuccessEmail, verifyPayment} = require("../controlllers/Payment")
router.post("/capturePayment",auth,isStudent,capturePayment)
router.post("/verifySignature",auth,isStudent,verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router