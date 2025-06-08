// admin middle ware
const express = require("express")
const router = express.Router()
const {createCategory, categoryPageDetails, getAllCategory} = require("../controlllers/Category")
const {auth,isAdmin, isStudent, isInstructor}= require("../middlewares/Auth");
const { createRatingAndReview, getAverageRating, getAllRating } = require("../controlllers/ratingAndReview");
const {updateSection, createSection, deleteSection} = require("../controlllers/Section")
const {createSubSection, deleteSubSection} = require("../controlllers/SubSection")
const {createCourse,editCourse,getInstructorCourses,deleteCourse,getFullCourseDetails,getCourseDetails} = require("../controlllers/Courses");
const { updateSubSection } = require("../controlllers/SubSection");
const {updateCourseProgress} = require("../controlllers/CourseProgress")
// categories controllers

router.post("/createCategory",auth,isAdmin,createCategory)
router.get("/showAllCategories", getAllCategory)
router.post("/getCategoryPageDetails",categoryPageDetails)
// course controllers
router.post("/create-Course",auth,isInstructor,createCourse)
router.post("/editCourse",auth,editCourse)
router.get("/getInstructorCourses",auth,getInstructorCourses)
router.delete("/deleteCourse",auth,deleteCourse)
router.post("/getFullCourseDetails",auth,getFullCourseDetails)
router.post("/getCourseDetails",getCourseDetails)
// sections controlllers
router.post("/addSection", auth,isInstructor,createSection)
router.post("/updateSection",auth, isInstructor,updateSection)
router.post("/deleteSection",auth,isInstructor,deleteSection)
// subsection

router.post("/createSubSection", auth, isInstructor,createSubSection)
router.post("/updateSubSection",auth,isInstructor, updateSubSection)
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection)

// rating and review

router.post("/createRating",auth,isStudent,createRatingAndReview)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews",getAllRating)

router.post("/updateCourseProgress", auth,updateCourseProgress)

module.exports = router
