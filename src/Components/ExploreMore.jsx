import React, { useState } from "react";
import { HomePageExplore } from "../data/homepage-explore";
import HighlightText from "../Components/HighlightText";
import CourseCard from "./CourseCard";

const tabsName = ["Free", "New to Coding", "Most Popular"];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(courses[0]?.heading || "");

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.find((course) => course.tag === value);
    if (result) {
      setCourses(result.courses);
      setCurrentCard(result.courses[0]?.heading || "");
    }
  };

  return (
    <div>
      <div className="text-4xl font-semibold text-center my-10">
        Unlock the <HighlightText text={"Power of Code"} />
      </div>
      <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
        Learn to build anything you can imagine
      </p>

      {/* Tabs Section */}
      <div className="hidden lg:flex gap-5 -mt-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
        {tabsName.map((el) => (
          <div
            key={el} // Using tab name as unique key
            className={`text-[16px] flex flex-row items-center gap-2 rounded-full transition-all duration-200 cursor-pointer px-7 py-2 
              ${
                currentTab === el
                  ? "bg-richblack-900 text-richblack-5 font-medium"
                  : "text-richblack-200"
              } hover:bg-richblack-900 hover:text-richblack-5`}
            onClick={() => setMyCards(el)}
          >
            {el}
          </div>
        ))}
      </div>

      <div className="hidden lg:block lg:h-[200px]"></div>

      {/* Course Cards Section */}
      <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {courses.map((element) => (
          <CourseCard
            key={element.heading} // Use heading as a unique key
            cardData={element}
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
          />
        ))}
      </div>
    </div>
  );
};

export default ExploreMore;
