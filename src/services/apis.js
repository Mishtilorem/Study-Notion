const BASE_URL = process.env.REACT_APP_BASE_URL

export const endpoints = {
   
    SEND_OTP_API: BASE_URL +"/auth/sendotp",
    SIGNUP_API: BASE_URL+ "/auth/signup",
    LOGIN_API: BASE_URL+"/auth/login",
    RESETPASSWORDTOKEN_API:BASE_URL+"/auth/reset-password-token",
    RESETPASSWORD_API:BASE_URL+"/auth/reset-password"
}
// PROFILE ENDPOINTS
export const profileEndpoints = {
    GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
    GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
    GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
  }
// students payment
export const studentEndpoints = {
    COURSE_PAYMENT_API:BASE_URL+"/payment/capturePayment",
    COURSE_VERIFY_API:BASE_URL+"/payment/verifySignature",
    SEND_PAYMENT_SUCCESS_EMAIL_API:BASE_URL+"/payment/sendPaymentSuccessEmail"
}

// subsection and section
export const courseEndpoints = {
    GET_ALL_COURSES_API:BASE_URL+"/course/getAllCourses",
    COURSE_DETAILS_API: BASE_URL+"/course/getCourseDetails",
    EDIT_COURSE_API:BASE_URL+"/course/editCourse",
    COURSE_CATEGORIES_API:BASE_URL+"/course/showAllCategories",
    CREATE_COURSE_API:BASE_URL+"/course/create-Course",
    CREATE_SECTION_API:BASE_URL+"/course/addSection",
    CREATE_SUBSECTION_API: BASE_URL+"/course/createSubSection",
    UPDATE_SECTION_API:BASE_URL + "/course/updateSection",
    UPDATE_SUBSECTION_API:BASE_URL+"/course/updateSubSection",
    GET_ALL_INSTRUCTOR_COURSES_API:BASE_URL+"/course/getInstructorCourses",
    DELETE_SECTION_API:BASE_URL+"/course/deleteSection",
    DELETE_SUBSECTION_API:BASE_URL+"/course/deleteSubSection",
    DELETE_COURSE_API:BASE_URL+"/course/deleteCourse",
    GET_FULL_COURSE_DETAILS_AUTHENTICATED:BASE_URL+"/course/getFullCourseDetails",
    LECTURE_COMPLETION_API:BASE_URL+"/course/updateCourseProgress",
    CREATE_RATING_API:BASE_URL+"/course/createRating"
}
// categories
export const categories={
    CATEGORIES_API : BASE_URL + "/course/showAllCategories",
}

// review and ratings 
export const ratingsEndpoints = {
    REVIEWS_DETAILS_API : BASE_URL+"/course/getReviews",
    
}
// catalog page data

export const catalogData = {
    CATALOGPAGEDATA_API : BASE_URL +"/course/getCategoryPageDetails",
}

// Contact-us API
export const contactusEndpoint = {
    CONTACT_US_API : BASE_URL+"/reach/contact",
}

// settings page api

export const settingsEndpoints = {
    UPDATE_DISPLAY_PICTURE_API : BASE_URL+"/profile/updateDisplayPicture",
    UPDATE_PROFILE_API : BASE_URL+"/profile/updateProfile",
    CHANGE_PASSWORD_API: BASE_URL+ "/auth/changepassword",
    DELETE_PROFILE_API: BASE_URL+"/profile/deleteProfile"
}
