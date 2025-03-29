import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignupProvider } from "./context/SignupContext"; // ✅ Ensure SignupProvider is used
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Step3 from "./pages/Step3";
import Step4 from "./pages/Step4";
import Dashboard from "./pages/Dashboard";
import ProfileReview from "./pages/ProfileReview";
import Landing from "./pages/Landing";
import Step5 from "./pages/Step5";
import Step6 from "./pages/Step6";
import Step7 from "./pages/Step7";
import Step8 from "./pages/Step8";

function App() {
  return (
    <SignupProvider> {/* ✅ Wrap everything inside SignupProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup/step1" element={<Step1 />} />
          <Route path="/signup/step2" element={<Step2 />} />
          <Route path="/signup/step3" element={<Step3 />} />
          <Route path="/signup/step4" element={<Step4 />} />
          <Route path="/signup/step5" element={<Step5 />} />
          <Route path="/signup/step6" element={<Step6/>} />
          <Route path="/signup/step7" element={<Step7/>} />
          <Route path="/signup/step8" element={<Step8/>} />
          <Route path="/profile-review" element={<ProfileReview />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Optional: Catch-all route */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </SignupProvider>
  );
}

export default App;