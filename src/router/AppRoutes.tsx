// src/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import "../index.css";
import Step1 from "../pages/Step1.tsx";
import Step2 from "../pages/Step2";
import Step3 from "../pages/Step3";
import Step4 from "../pages/Step4";
import Step5 from "../pages/Step5";
import Step6 from "../pages/Step6";
import Step7 from "../pages/Step7";
import Step8 from "../pages/Step8";
import Step9 from "../pages/Step9";
import Step10 from "../pages/Step10";
import Step11 from "../pages/Step11";
import Step12 from "../pages/Step12";
import Step13 from "../pages/Step13";
import Step14 from "../pages/Step14";
import Step15 from "../pages/Step15";
import Step16 from "../pages/Step16";
import ProfileReview from "../pages/ProfileReview";
import Dashboard from "../pages/Dashboard";
import Landing from "../pages/Landing";
import ClientJobPost from "../pages/ClientJobPost";

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