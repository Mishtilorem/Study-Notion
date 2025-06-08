import React from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { FcGoogle } from "react-icons/fc";
import frame from "../assets/frame.png";
import { useSelector } from "react-redux";

const Template = (props) => {
  const {loading} = useSelector((state) => state.auth)
  
  return (
    <div className="grid min-h -[calc(100vh-3.5rem)] place-items-center">
      {
        loading ?(
          <div className="spinner"></div>          
        ):(<div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
          <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
              {props.title}
            </h1>
            <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
              <span className="text-richblack-100">{props.description1}</span>
              <span className="font-edu-sa font-bold italic text-blue-100"> {props.description2}</span>
            </p>
    
            {props.formType === "login" ? <LoginForm /> : <SignupForm />}
    
            {/* <div className="flex w-full items-center gap-x-2 my-4">
              <div className="h-[1px] bg-richblack-700 w-full"></div>
              <p className="uppercase text-richblack-700 font-medium leading-[1.375rem]">
                or
              </p>
              <div className="h-[1px] bg-richblack-700 w-full"></div>
            </div> */}
    
            {/* <button className="flex rounded-md items-center justify-center border border-richblack-700 font-medium text-richblack-100 px-[12px] py-[8px] gap-x-2 mt-6">
              <FcGoogle />
              <p>Sign in with Google</p>
            </button> */}
          </div>
    
          <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
            <img src={frame} alt="patter" width={558} height={504} loading="lazy" />
            <img
              src={props.image}
              alt="pattern"
              width={558}
              height={504}
              loading="lazy"
              className="absolute -top-4 right-4 "
            />
          </div>
        </div>)
      }
    
    </div>
  );
};

export default Template;
