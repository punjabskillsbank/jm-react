// src/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import "../index.css";
import Step1 from "../Pages/Freelancer/Step01_Client-Freelancer";
import Step2 from "../Pages/Freelancer/Step02_SignupData";
import Step3 from "../Pages/Freelancer/Step03_Get_Started";
import Step4 from "../Pages/Freelancer/Step04_Experience";
import Step5 from "../Pages/Freelancer/Step05_Goal";
import Step6 from "../Pages/Freelancer/Step06_Work_Preference";
import Step7 from "../Pages/Freelancer/Step07_Create_Y_P";
import Step8 from "../Pages/Freelancer/Step08_Work_Category";
import Step9 from "../Pages/Freelancer/Step09_Title";
import Step10 from "../Pages/Freelancer/Step10_Skills";
import Step11 from "../Pages/Freelancer/Step11_Work_Experience";
import Step12 from "../Pages/Freelancer/Step12_Education";
import Step13 from "../Pages/Freelancer/Step13_ABC_Member";
import Step14 from "../Pages/Freelancer/Step14_Bio";
import Step15 from "../Pages/Freelancer/Step15_Hourly_Rate";
import Step16 from "../Pages/Freelancer/Step16_Details";
import ProfileReview from "../Pages/Freelancer/ProfileReview";
import Dashboard from "../Home/Dashboard";
import Landing from "../Home/Landing";
import ClientJobPost from "../Pages/Client/ClientJobPost";

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
      <Route path="/signup/step16" element={<Step16 />} />
      <Route path="/signup/profile-review" element={<ProfileReview />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/client/post-job" element={<ClientJobPost />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
  
    </Routes>
  );
};

export default AppRoutes;
export { AppRoutes };