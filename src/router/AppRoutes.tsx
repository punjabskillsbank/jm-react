// src/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import "../index.css";
import Step1 from "../pages/Freelancer/Signup/Step01_Client-Freelancer";
import Step2 from "../pages/Freelancer/Signup/Step02_Get_Started";
import Step3 from "../pages/Freelancer/Signup/Step03_Experience";
import Step4 from "../pages/Freelancer/Signup/Step04_Work_Preference";
import Step5 from "../pages/Freelancer/Signup/Step05_Create_Your_Profile";
import Step6 from "../pages/Freelancer/Signup/Step06_Work_Category";
import Step7 from "../pages/Freelancer/Signup/Step07_Title";
import Step8 from "../pages/Freelancer/Signup/Step08_Skills";
import Step9 from "../pages/Freelancer/Signup/Step09_Work_Experience";
import Step10 from "../pages/Freelancer/Signup/Step10_Hourly_Rate";
import Step11 from "../pages/Freelancer/Signup/Step11_Education";
import Step12 from "../pages/Freelancer/Signup/Step12_ABC_Member";
import Step13 from "../pages/Freelancer/Signup/Step13_Bio";
import Step14 from "../pages/Freelancer/Signup/Step14_Certificates";
import Step15 from "../pages/Freelancer/Signup/Step15_Details";
import ProfileReview from "../pages/Freelancer/Profile/ProfileReview";
import Dashboard from "../Home/Dashboard";
import Landing from "../Home/Landing";
import JobPost from '../pages/Client/JobPost';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup/step1" element={<Step1 />} />
      <Route path="/signup/step2" element={<Step2 />} />
      <Route path="/signup/step3" element={<Step3 />} />
      <Route path="/signup/step4" element={<Step4 />} />
      <Route path="/signup/step5" element={<Step5 />} />
      <Route path="/signup/step6" element={<Step6 />} />
      <Route path="/signup/step7" element={<Step7 />} />
      <Route path="/signup/step8" element={<Step8 />} />
      <Route path="/signup/step9" element={<Step9 />} />
      <Route path="/signup/step10" element={<Step10 />} />
      <Route path="/signup/step11" element={<Step11 />} />
      <Route path="/signup/step12" element={<Step12 />} />
      <Route path="/signup/step13" element={<Step13 />} />
      <Route path="/signup/step14" element={<Step14 />} />
      <Route path="/signup/step15" element={<Step15 />} />
      <Route path="/signup/profile-review" element={<ProfileReview />} />
      <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/post-job" element={<JobPost />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
  
    </Routes>
  );
};

export default AppRoutes;
export { AppRoutes };