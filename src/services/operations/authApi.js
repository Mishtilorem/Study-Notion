import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import {endpoints} from "../apis"
import {setLoading,setToken} from '../../slices/authSlices'
import {setUser} from'../../slices/profileSlice'

import { resetCart } from "../../slices/cartSlices";


const {
    SEND_OTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSWORDTOKEN_API,
    RESETPASSWORD_API
} = endpoints

export function login(email,password,navigate){
    return async (dispatch) =>{

        const toastId = toast.loading("Loading..")
        dispatch(setLoading(true))
        try{
            const res = await apiConnector("POST",LOGIN_API,{
                email,
                password
            })
            console.log("LOGIN API RESPONSE.......", res)
            if(!res.data.success){
                throw new Error(res.data.message)
            }
            toast.success("Login Sucessfully")
            dispatch(setToken(res.data.token))
            // console.log("heya",res.data.checkUser)
            const userImage = res.data?.user?.image
            ? res.data.user.image
            : `https://api.dicebar.com/5.x/initials/svg?seed=$(res.data.user.firstName) ${res.data.user.lastName}`
            dispatch(setUser({...res.data.user,image:userImage}))
            localStorage.setItem("token",JSON.stringify(res.data.token))
            localStorage.setItem("user",JSON.stringify(res.data.user))
            navigate("/dashboard/my-profile")
        }
        catch(err){
            console.log("LOGIN API ERROR", err)
            toast.error("Login Failed")
        }
        dispatch(setLoading(false))

        toast.dismiss(toastId)
    }
}
export function sendOtp(email,navigate){
    return async (dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            const res = await apiConnector("POST", SEND_OTP_API, {
                email,
                checkUserPresent:true,
                        })
        console.log("SENDOTP API RESPONSE...",res)
        console.log(res.data.success)
        if(!res.data.success){
            throw new Error(res.data.message)
        }
        toast.success("OTP sent successfully")
        navigate("/verify-email")
        }
        catch(err){
            console.log("SENDOTP API ERROR....", err)
            toast.error("Could not send OTP")
        }
        dispatch(setLoading(false))

        toast.dismiss(toastId)
    }
}

export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate)

{
    return async (dispatch)=>{
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            const res = await apiConnector("POST", SIGNUP_API,{
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp,
                
            })
            console.log("SIGNUP API RESPONSE...", res)
            if(!res.data.success){
                throw new Error(res.data.message)
            }
            toast.success("Signup successfully")
        navigate("/login")
        }
        catch(err){
            console.log("SIGNUP API ERROR....", err)
            
            toast.error("Could not signup")
            navigate("/signup")
}
dispatch(setLoading(false))

        toast.dismiss(toastId)
}
}


export function LogOut(navigate){
    return(dispatch) =>{
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}


export function getPasswordResetToken(email,setEmailSent){
    return async(dispatch) =>{
            dispatch(setLoading(true));
            try{
                const res = await apiConnector("POST", RESETPASSWORDTOKEN_API,{email})
                console.log("RESET PASSWORD TOKEN IS....,",res)
                if(!res.data.success){
                    throw new Error(res.data.message)
                }
                toast.success("Reset Email Sent")
                setEmailSent(true)
            }
            catch(err){
                console.log("Error sending reset password email:", err);

toast.error("Failed",err)
            }
            dispatch(setLoading(false))   
    }
}



export function resetPassword(password, confirmPassword, token) {
    return async(dispatch) => {
      dispatch(setLoading(true));
      try{
        const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});
  
        console.log("RESET Password RESPONSE ... ", response);
  
  
        if(!response.data.success) {
          throw new Error(response.data.message);
        }
  
        toast.success("Password has been reset successfully");
      }
      catch(error) {
        console.log("RESET PASSWORD TOKEN Error", error);
        toast.error("Unable to reset password");
      }
      dispatch(setLoading(false));
    }
  }