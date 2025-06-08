const User = require("../models/User")
const Profile = require("../models/Profile")
const CourseProgress = require("../models/CourseProgress")
const mongoose  = require("mongoose")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const Course = require("../models/Course")
// yaha isliye update kyuki ek dummy prifle values aready bani h.
const {convertSecondsToDuration} = require('../utils/secToDuration')

exports.updateProfile = async(req,res) =>{
    try{
        // get data
        const { firstName = "",
          lastName = "",dateOfBirth="",about="",contactNumber,gender} = req.body
          
        const userID = req.user.id
        
        // get userID
        // validation
        if(!contactNumber || !gender || !userID){
            return res.status(403).json({
                success:false,
                message:'Fill all details'
            })
        }
        // find profile and update
        const userDetails = await User.findById(userID)
        const user = await User.findByIdAndUpdate(userID, {
          firstName,
          lastName,
        },{ new: true })
        await user.save()
        const profileID = userDetails.additionalDetails
        const updatedProfile = await Profile.findByIdAndUpdate(profileID,{
            dateOfBirth:dateOfBirth,
            about:about,
            contactNumber:contactNumber,
            gender:gender
        },{ new: true })
        // const updatedProfile = await Profile.findById(profileID)
        // updatedProfile.dateOfBirth=dateOfBirth
        // updatedProfile.about=about
        // updatedProfile.contactNumber=contactNumber
        // updatedProfile.gender=gender
        // await updatedProfile.save()
        const updatedUserDetails = await User.findById(userID)
        .populate({
          path: "additionalDetails",
          select: "gender dateOfBirth about contactNumber",
      })
        console.log(updatedUserDetails)
        // return res.
        return res.status(200).json({
            success:true,
            message:'Profile updated and saved successfully',
            updatedUserDetails
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:'Profile updation failed'
        })
    }
}

exports.deleteProfile = async(req,res) =>{
    try{
        // data fecth
        const id = req.user.id
        // data validation
        const userDetails = await User.findById(id)

        // delete proile also associated with user
        // await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
        // await Profile.findByIdAndDelete({
        //   _id: new mongoose.Types.ObjectId(user.additionalDetails),
        // })
        await Profile.findByIdAndDelete({
          _id: new mongoose.Types.ObjectId(userDetails.additionalDetails),
        })
        for (const courseId of userDetails.courses) {
          await Course.findByIdAndUpdate(
            courseId,
            { $pull: { studentsEnroled: id } },
            { new: true }
          )
        }
        // delete user
        await User.findByIdAndDelete({_id:id})
        await CourseProgress.deleteMany({ userId: id })
        // return res
        return res.status(200).json({
            success:true,
            message:'Deleted'
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Can't delete"
        })
    }
}



exports.getAllUserDetails = async(req,res)=>{
    try{
        const id = req.user.id;
        const userDetails = await User.findById(id)
        .populate("additionalDetails").exec();
        console.log(userDetails,"user details controller");
        res.status(200).json({
            success:true,
            message:"User Data fetched successfully",
            data: userDetails
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}


exports.updateDisplayPicture = async (req, res) => {
  // console.log(req.files)
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      console.log(userId,"id")
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      })
    }
  }
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()
      userDetails = userDetails.toObject()
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
  // console.log(userDetails,"user")
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ instructor: req.user.id })
  
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course?.studentsEnrolled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }