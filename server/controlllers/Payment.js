const {instance} = require("../config/razorpay");
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const crypto = require("crypto")
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail")
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")


// capture the payment and initiate the razorpay order.

// exports.capturePayment = async(req,res)=>{
//     // get userID and courseID
//     // vlaidation
//     // user already pay
//     // order creat
//     try{
//         const {course_id} = req.body
//         const userId = req.user.id;
//         if(!course_id){
//             return res.json({
//                 success:false,
//                 message:'Please provide valid course ID'
//             })
//         }
//         // validating course
//         let course = await Course.findById(course_id);
//         if(!course){
//             return res.json({
//                 success:false,
//                 message:'Could not find the course'
//             })
//         }
//         // validating user.
//         // as user id extracted form req.body has datat typestring so onverting in object
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)){
//             return res.json({
//                 success:false,
//                 message:'Student is already enrolled',
//             })
//         }
    
    
//     // order create
//     const amount = course.price;
//     const currency = "INR";
//     const options = {
//         amount:amount*100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId:course_id,
//             userId
//         }
//     }
//     try{
//         // initiated the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse)
//         res.status(200).json({
//         courseName:course.courseName,
//         courseDescription:course.courseDescription,
//         thumbnail: course.thumbnail,
//         orderId: paymentResponse.id,
//         currency:paymentResponse.currency,
//         amount:paymentResponse.amount
//         })
//     }
//     catch(err){
//         return res.status(500).json({
//             success: false,
//             message: "Could not initiate order",
//         })
//     }
// }
//     catch(err){
//         return res.status(500).json({
//             success:false,
//             message:err.message
//         })

//     }
// }

// // verify signature of Razorpay and server(backend)
// exports.verifySignature = async(req,res) =>{
//     try{
//         const webhookSecret = "123456";
//         const signature = req.header("x-razorpay-signature");
//         // razaorpay ne hashed way m bheji h.
//         const shasum = crypto.createHmac("sha256",webhookSecret);
//         shasum.update(JSON.stringify(req.body))
//         // hashing algo jb string p run then output is digest in hexa decimal form(shasum is digest)
//         const digest = shasum.digest("hex")
//         if(signature===digest){
//             console.log("Payment is authorized")
//         }
//         // now action after payment successful
//         const{courseId, userId} = req.body.payload.payment.entity.notes;
//         // sudent ko enroll krao

//         try{
//             // user k course array m ye course dalo
//         // course m user enrolled m isko dalo.
//             const enrolledCourse = await Course.findOneAndUpdate({_id:courseId},{$push:{studentsEnrolled:userId}},{new:true});
//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     message:"Course Not Found"
//                 })
//             }
//             const enrolledStudent = await User.findOneAndUpdate({_id:userId},{$push:{courses:courseId}},{new:true})
//             console.log(enrolledStudent)
//             // mail send
//             const emailResponse = await mailSender(
//                 enrolledStudent.email,
//                 "Congratulations",
//                 "Congratulations, you are onboarded in the Course",
//             )
//         }
//         catch(err){
//             return res.status(500).json({
//                 success:false,
//                 message:'Could not enroll student'
//             })
//         }
        
        
//     }
//     catch(err){
//         return res.status(500).json({
//             success:false,
//             message:'Could not authorize the payment'
//         })
//     }
// }



// capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
    const { courses } = req.body
    const userId = req.user.id
   
    if (courses.length === 0) {
      return res.json({ success: false, message: "Please Provide Course ID" })
    }
  
    let total_amount = 0
  
    for (const course_id of courses) {
      let course
      try {
        // Find the course by its ID
        course = await Course.findById(course_id)
  
        // If the course is not found, return an error
        if (!course) {
          return res
            .status(200)
            .json({ success: false, message: "Could not find the Course" })
        }
        // console.log(course,"course for capture pyament")
        // Check if the user is already enrolled in the course
        console.log(userId,"userid")
        const uid = new mongoose.ObjectId(userId)
        console.log(uid,"uid")
        if (course.studentsEnrolled.includes(userId)) {
          return res
            .status(200)
            .json({ success: false, message: "Student is already Enrolled" })
        }
  
        // Add the price of the course to the total amount
        total_amount += course.price
      } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
      }
    }
  
    const options = {
      amount: total_amount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    }
  
    try {
      // Initiate the payment using Razorpay
      const paymentResponse = await instance.orders.create(options)
      console.log(paymentResponse,"this is after creating order")
      console.log(process.env.RAZORPAY_KEY,"this is in backend")
      res.json({
        success: true,
        data: paymentResponse,
      })
    } catch (error) {
      console.log(error)
      res
        .status(500)
        .json({ success: false, message: error.message })
    }
  }
  


  exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
    
    const userId = req.user.id
  
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return res.status(200).json({ success: false, message: "Payment Failed" })
    }
  
    let body = razorpay_order_id + "|" + razorpay_payment_id
    // console.log("signatire wale p")
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex")
  
    if (expectedSignature === razorpay_signature) {
      await enrollStudents(courses, userId, res)
      return res.status(200).json({ success: true, message: "Payment Verified" })
    }
  
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }
  
  // Send Payment Success Email
  exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body
  
    const userId = req.user.id
  
    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" })
    }
  
    try {
      const enrolledStudent = await User.findById(userId)
  
      await mailSender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          amount / 100,
          orderId,
          paymentId
        )
      )
    } catch (error) {
      console.log("error in sending mail", error)
      return res
        .status(400)
        .json({ success: false, message: "Could not send email" })
    }
  }
  


  const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }
  
    for (const courseId of courses) {
      try {
        // Find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnrolled: userId } },
          { new: true }
        )
  
        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse)
  
        const courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        })
        // Find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )
  
        // console.log("Enrolled student: ", enrolledStudent)
        // Send an email notification to the enrolled student
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
  
        // console.log("Email sent successfully: ", emailResponse)
      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
      }
    }
  }