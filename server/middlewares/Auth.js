const jwt = require("jsonwebtoken")
require("dotenv").config()

const User = require("../models/User")

// auth 
exports.auth = async(req,res,next) =>{
    try{
        // extract token
        const token = req.cookies.token || req.body.token || (req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : "");
        // if token missing,then return response.
       
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            })
        }
        // verify the token.
        try{
            const decode = await jwt.verify(token,process.env.JWT_SECRET);
            // console.log(decode)
            req.user = decode
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:'token is invalid'
            })
        } 
        next();
    }
    catch(err){
        console.log(err)
        return res.status(401).json({
            success:false,
            message:'something went wrong'
        })
    }
}

exports.isStudent = async(req,res,next) => {
    // token decode m role bhi dega as payload k andr h data m,
    try{
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message: 'This is  a protected route for students'
            })
        }
        next()
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified please try again'
        })
    }
}

exports.isInstructor = async(req,res,next) => {
    // token decode m role bhi dega as payload k andr h data m,
    try{
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message: 'This is  a protected route for instructor'
            })
        }
        next()
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified please try again'
        })
    }
}

exports.isAdmin = async(req,res,next) => {
    // token decode m role bhi dega as payload k andr h data m,
    try{
        
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message: 'This is  a protected route for students'
            })
        }
        next()
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified please try again'
        })
    }
}



