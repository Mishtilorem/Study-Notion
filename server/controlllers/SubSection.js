const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()
exports.createSubSection = async(req,res) =>{
    try{
        // fetch data from req body
        const {sectionId,title,description} = req.body
        // extract file/video
        const video = req.files.video
        // validation
        if(!sectionId || !title  || !description || !video){
            return res.status(400).json({
                success: false,
                message:'Fill all'
            })
        }
        // console.log(sectionId,"id")
        
        // uploadvideo to cloudinayr
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)
        // create a sub section
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration: `${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url
        })
        // console.log(SubSectionDetails._id,"subsection id")
        // now insert subsection id in section.
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},{$push:{
            subSection:SubSectionDetails._id
        }},{new:true}).populate("subSection").exec()
        // console.log(updatedSection,"updated section")
        return res.status(200).json({
            success:true,
            message:'Subsection updated',
            updatedSection
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Sub section not created.",
            err:err.message

            
        })
    }

}


exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId, subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )
  
    //   console.log("updated section", updatedSection)
  
      return res.json({
        success: true,
        message: "Section updated successfully",
        data: updatedSection,
      })
    } catch (error) {
    //   console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }
  

exports.deleteSubSection = async (req,res) =>{
    try{
        const {subSectionId, sectionId} =req.body
        await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $pull:{
                    subSection:subSectionId,
                },
            }
        )
        const subSection  =await SubSection.findByIdAndDelete({_id:subSectionId})
        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"SubSection not found"
            })
        }
         // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )
  
        return res.status(200).json({
            success:true,
            message:"SubSection deleted Success",
            data: updatedSection,
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Could not delete"
        })
    }
}