import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup"
import Login from './pages/Login'
import ResetPassword from "./pages/ResetPassword"
import OpenRoute from "./Components/OpenRoute";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact"
import Dashboard from "./pages/Dashboard"
import PrivateRoute from "./Components/Auth/PrivateRoute";
import MyProfile from "./Components/Dashboard/MyProfile"
import Settings from "./Components/Dashboard/Settings";
import Error from './pages/Error'
import { ACCOUNT_TYPE } from "./utils/constants";
import EnrolledCourses from "./Components/Dashboard/EnrolledCourses";
import AddCourse from "./Components/Dashboard/AddCourse/index"
import EditCourse from './Components/Dashboard/EditCourse/index'
import MyCourses from './Components/Dashboard/MyCourse';
import Instructor from './Components/Dashboard/InstructorDashboard/Instructor'
import Cart from'./Components/Dashboard/Cart/index'
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import VideoDetails from "./Components/ViewCourse/VideoDetails";
import ViewCourse from "./pages/ViewCourse";


function App() {  const { user } = useSelector((state) => state.profile)
  return (
    
      <div className="w-screen min-h-screen bg-richblack-900 font-semibold">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}>
          </Route>
          <Route path="catalog/:catalogName" element={<Catalog/>} />
      <Route path="courses/:courseId" element={<CourseDetails/>} />
          <Route 
          path = "signup"
          element={
            <OpenRoute>
              <Signup/>
            </OpenRoute>
          }
          />
          <Route 
          path = "login"
          element={
            <OpenRoute>
              <Login/>
            </OpenRoute>
          }
          />
          <Route 
          path = "forgot-password"
          element={
            <OpenRoute>
              <ResetPassword/>
            </OpenRoute>
          }
          />
          <Route 
          path = "update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword/>
            </OpenRoute>
          }
          />
          <Route 
          path = "verify-email"
          element={
            <OpenRoute>
              <VerifyEmail/>
            </OpenRoute>
          }
          />
          <Route 
          path = "about"
          element={
            
              <About/>
            
          }
          />
          <Route path="/contact" element={<Contact />} />
          <Route 
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }>
      <Route path="dashboard/my-profile" element={<MyProfile />} />
    <Route path="dashboard/settings" element={<Settings />} />
    {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route path="dashboard/cart" element={<Cart />} />
          
          <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
          </>
        )
      }
      {
        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
          <Route path="dashboard/instructor" element={<Instructor />} />
          {/* <Route path="dashboard/instructor" element={<Instructor />} /> */}
          <Route path="dashboard/add-course" element={<AddCourse />} />
          {/* <Route path="dashboard/my-courses" element={<MyCourses />} /> */}
          <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
          <Route path="dashboard/my-courses" element={<MyCourses />} />
          </>
        )
      }
    </Route>
    <Route element={
        <PrivateRoute>
          <ViewCourse />
        </PrivateRoute>
      }>

      {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route 
            path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
            element={<VideoDetails />}
          />
          </>
        )
      }

      </Route>
    
    <Route path="*" element={<Error />} />
        </Routes>
      </div>
  )
}

export default App;
