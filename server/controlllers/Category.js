const Category = require('../models/Category')
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }
  const mongoose = require('mongoose')
// create tag
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body
        if (!name || !description) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required'
            })
        }
        // create tag entry in db
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        })
        console.log(categoryDetails)
        return res.status(200).json({
            success: true,
            message: 'Category created successfully'
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// get  all tag
exports.getAllCategory = async (req, res) => {
    try {
        const allTags = await Category.find({}, { name: true, description: true })
        return res.status(200).json({
            success: true,
            message: 'All tags are here',
            allTags
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body
        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
            .populate({path:"course",
                match: { status: "Published" },
        //   populate: "ratingAndReviews",
            })
            .exec();
        // console.log(selectedCategory);
        if (!selectedCategory) {
            console.log("Category not found");
            return res.status(404)
                .json({
                    success: false,
                    message: "Category not found",
                    
                })
        }
        // handle the case when there are no courses
        if (selectedCategory.course.length === 0) {
            console.log("No Courses found for the selected category")
            return res.status(401).json({
                success: false,
                message: "No courses found for the selected category"
            })
        }
        // get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId }
        }).populate("course");
        
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
              ._id
          )
            .populate({
              path: "course",
              match: { status: "Published" },
            })
            .exec()
            //console.log("Different COURSE", differentCategory)
        // get top-selling courses across all categories
        
        const allCategories = await Category.find()
        .populate({
          path: "course",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
        const allCourses = allCategories.flatMap((category) => category.course);
        const mostSellingCourses = allCourses.sort((a, b) => b.sold - a.sold)
            .slice(0, 10);

        res.status(200).json({
            success:true,
            selectedCategory: selectedCategory,
            differentCategory: differentCategory,
            mostSellingCourses: mostSellingCourses
        })

    }
    catch(err){
            return res.status(500).json({
                success:false,
                message:err.message
            })
    }
}
