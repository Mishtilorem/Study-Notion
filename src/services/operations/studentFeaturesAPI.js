import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo.svg"
import {setPaymentLoading} from '../../slices/courseSlice'
import { resetCart } from "../../slices/cartSlices";
const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints



function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        console.log('this is running fine')
        script.onload = () => {
            resolve(true);
        }
        script.onerror= () =>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
    

}


export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    console.log(courses,"courses")
//     console.log("Razorpay on window2:", window.Razorpay);
// console.log("Razorpay Key:", process.env.REACT_APP_RAZORPAY_KEY);
// console.log("Razorpay secret",process.env.REACT_APP_RAZORPAY_SECRET)
    const toastId = toast.loading("Loading...");
    try{
        // load the script
        // before calling razorpay wala
        console.log("hehe")
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        console.log("res",res)
        console.log("COURSE_PAYMENT_API:", COURSE_PAYMENT_API);

        if(!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }
if (!window.Razorpay) {
  toast.error("RazorPay SDK failed to load");
  console.error("Razorpay SDK not available on window");
  return;
}
        //initiate the order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, 
                                {courses},
                                {
                                    Authorization: `Bearer ${token}`,
                                })
                                

        if(!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
            
        }
        console.log("PRINTING orderResponse", orderResponse);
        //options
                const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id:orderResponse.data.data.id,
            name:"StudyNotion",
            description: "Thank You for Purchasing the Course",
            image:rzpLogo,
            prefill: {
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler: function(response) {
                //send successful wala mail
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount,token );
                //verifyPayment
                verifyPayment({...response, courses}, token, navigate, dispatch);
            }
        }
        //miss hogya tha 
        const paymentObject = new window.Razorpay(options);
        console.log(options,"kdewod")
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed");
            console.log(response.error);
            
        })

    }
    catch(error) {
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment");
        return ;
        
    }
    toast.dismiss(toastId);
     
    return
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
    }
    catch(error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

//verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization:`Bearer ${token}`,
        })

        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("payment Successful, you are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}