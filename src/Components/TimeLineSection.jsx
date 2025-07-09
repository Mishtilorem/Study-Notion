import React from "react";
import Logo1 from '../assets/Logo1.73daf51e41d665299fc682bc3cb53878.svg'
import Logo2 from '../assets/Logo2.2d9e85de9e756cda89ffc4582338c939.svg'
import Logo3 from '../assets/Logo3.0a56f78fead602f0d54c55ddcdf7e616.svg'
import Logo4 from '../assets/Logo4.5da4c6e0c53e6745b25529891ef82458.svg'
import ladki from '../assets/8dc76f3e2d56cca8f05fa46b09dbc0d7.jpg'
const timeline =[
    {
        Logo:Logo1,
        heading:"Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo2,
        heading:"Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo3,
        heading:"Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo4,
        heading:"Leadership",
        Description:"Fully committed to the success company",
    },
    
]
const TimeLineSection =() =>{
    return (
        <div>
            <div className="flex flex-col lg:flex-row gap-20 mb-20 items-center">
                <div className="lg:w-[45%] flex flex-col gap-14 lg:gap-3">
                {
                    timeline.map((element,index)=>{
                        return (
                            <div className="flex flex-col lg:gap-3" key={index}>
                                <div className="w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]">
                                    <img src={element.Logo} alt=""/>
                            </div>
                            <div>
                                <h2 className="font-semibold text-[18px]">{element.heading}</h2>
                                <p className="text-base">{element.Description}</p>
                                </div>
                                <div
                  className={`hidden ${
                    timeline.length - 1 === index ? "hidden" : "lg:block"
                  }  h-14 border-dotted border-r border-richblack-100 bg-richblack-400/0 w-[26px]`}
                ></div>
                            </div>
                        )

                    })
                }
                
                
            </div>
            <div className="relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px] ">
                <img src={ladki}
                alt ="timelineImage"
                className ="shadow-white " ></img>
            <div className="absolute lg:left-[50%] lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[50%] bg-caribbeangreen-700 flex lg:flex-row flex-col text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10">
                <div className="flex gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14">
                    <p className="text-3xl font-bold w-[75px]">10</p>
                    <p className="text-caribbeangreen-300 text-sm w-[75px]">Years of Experience</p>

                </div>
                <div className="flex gap-5 items-center px-7">
                    <p className="text-3xl font-bold">250</p>
                    <p className="text-caribbeangreen-300 text-sm">Type of Courses</p>
                </div>

            </div>
            </div>
        </div>
        </div>
    )
  
}

export default TimeLineSection