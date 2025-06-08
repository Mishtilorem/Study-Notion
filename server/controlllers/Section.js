const Section = require("../models/Section")
const Course = require("../models/Course")
const SubSection = require("../models/SubSection")
exports.createSection = async (req,res) =>{
    try{
        // data fetch
        const {sectionName,courseID} = req.body;
        // data validation
        if(!sectionName || !courseID){
            return res.status(400).json({
                success:false,
                message:'Missing data'
            })
        }
        // create section
        const newSection = await Section.create({sectionName})
        // update in course with section objectID
        
        const updatedCourse = await Course.findByIdAndUpdate(courseID,{
            $push:{
                courseContent:newSection._id
            }
        },{new:true}).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();
        
        return res.status(200).json({
            success:true,
            message:"Section added",
            updatedCourse
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Section can't be created"   
        })
    }
}

exports.updateSection = async(req,res) =>{
    try{
        // abhi bs titile hi h toh wo udpate
        // data fecth
        const{sectionName,sectionId,courseID} = req.body;
        // data validation
        if(!sectionId || !sectionName){
            return res.status(400).json({
                success:false,
                message:'Missing data'
            })
        }
        // ab course update nhi krna kyuki usme id h oth wo change hogi hi nhi
        const updatedSectionDetails = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
        const course = await Course.findById(courseID)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();
        
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            course
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to update section"
        })
    }
}

exports.deleteSection  =async(req,res) =>{
    try{
        // data fetch let's iss baar parameter se lete
        const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		// console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

        //find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();
        // return res
        return res.status(200).json({
            success:true,
            message: "Section Deleted Successfully.",
            data:course
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to delete section"
        })
    }
}


