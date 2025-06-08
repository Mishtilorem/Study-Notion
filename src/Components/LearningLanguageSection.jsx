import React from 'react'
import HighlightText from './HighlightText'
import Button from './Button'
import know_your_progress from '../assets/Know_your_progress.cf3ea1c51544985430d3.png'
import compare_with from '../assets/Compare_with_others.8e950efa990d53f34b35893a1e03cea1.svg'
import plan_with from '../assets/Plan_your_lessons.f123ccf442a2a364a459a7bbec807045.svg'

const LearningLanguageSection = () => {
    return (
      <div>
          <div className="text-4xl font-semibold text-center my-10">
              Your swiss knife for
              <HighlightText text={"learning any language"} />
              <div className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
                Using spin making learning multiple languages easy. with 20+
                languages realistic voice-over, progress tracking, custom schedule
                and more.
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0">
                <img
                  src={know_your_progress}
                  alt=""
                  className="object-contain  lg:-mr-32 "
                />
                <img
                  src={compare_with}
                  alt=""
                  className="object-contain lg:-mb-10 lg:-mt-0 -mt-12"
                />
                <img
                  src={plan_with}
                  alt=""
                  className="object-contain  lg:-ml-36 lg:-mt-5 -mt-16"
                />
              </div>
            </div>
  
            <div className="w-fit mx-auto lg:mb-20 mb-8 -mt-5">
              <Button active={true} linkto={"/signup"}>
                <div className="">Learn More</div>
              </Button>
            </div>
      </div>
    )
  }
export default LearningLanguageSection