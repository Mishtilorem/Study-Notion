const Course = require('../models/Course')
const Category=  require('../models/Category')
const User = require('../models/User')
const Section = require('../models/Section')
const SubSection = require('../models/SubSection')
const { uploadImageToCloudinary } = require('../utils/imageUploader')
require("dotenv").config()

const CourseProgress =require("../models/CourseProgress")
const {convertSecondsToDuration} = require("../utils/secToDuration")
// create course handler
exports.createCourse = async(req,res) =>{
    try{
        //if this step is there then user is already logged in
        // now we will find out account type using db call pichli baar id se exract se kiya tha.
        let{courseName,courseDescription,whatYouWillLearn,price,category,tag,instructions,status} = req.body
        // get thumbnail
        console.log(req.files)
        console.log("print")
        
        if (!req.files || !req.files.thumbnail) {
            return res.status(400).json({ success: false, message: "Thumbnail iag is required" });
        }
        const thumbnail = req.files.thumbnail
        const tags = JSON.parse(tag)
    const instruction = JSON.parse(instructions)

    console.log("tag", tags)
    console.log("instructions", instruction)

        
        // validation
        if(!courseDescription || !courseName ||!price || !whatYouWillLearn || !category || !tags.length || !instruction.length){
            return res.status(403).json({
                success:false,
                message:'all fields required'
            });
        }
        if (!status || status === undefined) {
          status = "Draft"
        }
        // check for instructor details,(jo bana rha course vhi instrcutor)
        // middleware ki help se already vhi aa rha hoga jo instructor h
        const userId  = req.user.id
        const instructorDetails = await User.findById(userId)
       
        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor not found"
            })
        }
        // check tag valid
        const categoryDetails = await Category.findById(category);
        // modelk hisab se tag is ref id
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:'category Details not found'
            })
        }
        console.log("print in ")
        // upload image top coludinary
        
        
        const thumbnailimage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)
   
    // CREATE NEW NETRY OF NEW COURSE

    const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor:instructorDetails._id,        
        whatYouWillLearn:whatYouWillLearn,
        price,
        tag:tags,
        category:categoryDetails._id,
        thumbnail:thumbnailimage.secure_url,
        status:status,
        instructions:instruction
    })
    // user k courses list update kro,
    await User.findByIdAndUpdate({_id:instructorDetails._id},{
        $push:{
            courses:newCourse._id,
        }
    },{new:true})
    // uss category m ye course add kro
    await Category.findByIdAndUpdate({ _id: category},{
        $push:{
            course:newCourse._id,
        }
    }, { new: true })
    return res.status(200).json({
        success:true,
        message:'New course added',
        newCourse
    })
}   
    // isme sb according model of course
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
            
        })
    }
} 

exports.getAllCourses = async (req,res) =>{
    try{
        const allCourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReview:true,
            studentEnrolled:true
        }).populate("instructor")
        .exec()
        // if we don't write populate then instructor ki id show hogi as per model but hume name chahiye.
        return res.status(200).json({
            success:true,
            message:'Data for all courses',
            allCourses
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:'Cannot fetch course data'
        })
    }
}

exports.getCourseDetails = async(req,res)=>{
    try{
        // data fetch
        // find coursedetails
        // populate each with id
        const{courseId} = req.body;
        const courseDetails = await Course.findById(
                                                    {_id:courseId})
                                                    .populate({
                                                        path:"instructor",
                                                        populate:{
                                                            path:"additionalDetails"
                                                        }

                                                    })
                                                    .populate("category")
                                                    .populate("ratingAndReview")
                                                    .populate(
                                                        {
                                                            path:"courseContent",
                                                            populate:{
                                                                path:"subSection",
                                                                select: "-videoUrl",
                                                            }
                                                        }
                                                    )
                                                    .exec()
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Could not find course"
            })
        }
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
          content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
          })
        })
    
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        return res.status(200).json({
            success:true,
            message:'Course Details',
            data:courseDetails,
            totalDuration
            
        })
    }
    catch(err){
        return res.status(500).json({
            success:true,
            message:"Can't find the course"
        })
    }
}


exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }
  exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  // console.log(instructorCourses)
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }
  // Delete the Course
  exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body
    
        // Find the course
        const course = await Course.findById(courseId)
        if (!course) {
          return res.status(404).json({ message: "Course not found" })
        }
    
        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled
        for (const studentId of studentsEnrolled) {
          await User.findByIdAndUpdate(studentId, {
            $pull: { courses: courseId },
          })
        }
    
        // Delete sections and sub-sections
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
          // Delete sub-sections of the section
          const section = await Section.findById(sectionId)
          if (section) {
            const subSections = section.subSection
            for (const subSectionId of subSections) {
              await SubSection.findByIdAndDelete(subSectionId)
            }
          }
    
          // Delete the section
          await Section.findByIdAndDelete(sectionId)
        }
    
        // Delete the course
        await Course.findByIdAndDelete(courseId)
    
        return res.status(200).json({
          success: true,
          message: "Course deleted successfully",
        })
      } catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        })
      }
    }

exports.getFullCourseDetails = async (req, res) => {
        try {
          const { courseId } = req.body
          const userId = req.user.id
          const courseDetails = await Course.findOne({
            _id: courseId,
          })
            .populate({
              path: "instructor",
              populate: {
                path: "additionalDetails",
              },
            })
            .populate("category")
            .populate("ratingAndReview")
            .populate({
              path: "courseContent",
              populate: {
                path: "subSection",
              },
            })
            .exec()
      
          let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
          })
      
          // console.log("courseProgressCount : ", courseProgressCount)
      
          if (!courseDetails) {
            return res.status(400).json({
              success: false,
              message: `Could not find course with id: ${courseId}`,
            })
          }
      
          // if (courseDetails.status === "Draft") {
          //   return res.status(403).json({
          //     success: false,
          //     message: `Accessing a draft course is forbidden`,
          //   });
          // }
      
          let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
      
          return res.status(200).json({
            success: true,
            data: {
              courseDetails,
              totalDuration,
              completedVideos: courseProgressCount?.completedVideos
                ? courseProgressCount?.completedVideos
                : [],
            },
          })
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
          })
        }
      }
      
