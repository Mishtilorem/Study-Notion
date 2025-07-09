const express = require("express")
const router = express.Router()
const {auth} = require("../middlewares/Auth")

const{
    deleteProfile,
    updateProfile,getAllUserDetails,
    getEnrolledCourses,
    updateDisplayPicture,instructorDashboard
    
    
} = require("../controlllers/Profile")

router.delete("/deleteProfile" ,auth,deleteProfile)
router.put("/updateProfile",auth,updateProfile)
router.get("/getUserDetails",auth,getAllUserDetails)
router.put("/updateDisplayPicture",auth,updateDisplayPicture)
router.get("/getEnrolledCourses",auth,getEnrolledCourses)
router.get("/instructorDashboard",auth,instructorDashboard)


module.exports = router