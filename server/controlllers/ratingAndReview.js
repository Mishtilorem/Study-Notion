const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course");
const mongoose = require('mongoose')

exports.createRatingAndReview = async(req,res) =>{
    try{
        // get relevant data.
        const userId = req.user.id;
        const {rating, review,courseId} = req.body;
        // check user is enrolled in that course
        const courseDetails = await Course.findOne(
                                        {_id:courseId,
                                        studentsEnrolled:{$elemMatch:{$eq:userId}},

        })
        
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the course"
            })
        }
        // check ek baar review one student.
        const alreadyReviewed = await RatingAndReview.findOne({
                                            user:userId,
                                            course:courseId,
        })
        if(alreadyReviewed){
            return res.json({
                message:"already reviewed"
            })
        }
        // create
        const ratingAndReview = await RatingAndReview.create({
                                                rating,review,course:courseId,
                                                user:userId
        })
        // update in course
        const updatedCourseDeatils = await Course.findByIdAndUpdate({_id:courseId},
            {
                $push:{
                    ratingAndReview:ratingAndReview._id,
                }
            },
            {new:true}
        )
        console.log(updatedCourseDeatils)
        return res.status(200).json({
      success: true,
      message: "Review created successfully",
      ratingAndReview,
    });
    }

    
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Rating cant be published."
        })
    }
}


exports.getAverageRating = async(req,res) =>{
    try{
        // get courseId
        const courseId = req.body.courseId;
        // db call and aggregation
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    // string se object id m convert
                    course:new mongoose.Types.ObjectId(courseId),
                }
            },
            // ab insbko grp krke calculations
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"}
                }
            }
        ])
         // return res
        // if empty then check also
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating
            })
        }
        return res.status(200).json({
            success:true,
            message:'Average Rating is 0, no ratings given till now'
            ,averageRating:0
        })
        
       

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

exports.getAllRating = async (req,res) =>{
    try{
        const allReviews  = await RatingAndReview.find({})
                                        .sort({rating:"desc"})
                                        .populate({
                                            path:"user",
                                            select:"firstName lastName email image"
                                        })
                                        .populate({
                                            path:"course",
                                            select:"courseName",
                                        })
                                        .exec();
                        return res.status(200).json({
                            success:true,
                            message:"All reviews fetched successfully",
                            data:allReviews
                        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }

}