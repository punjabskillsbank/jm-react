import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Step1 from "../pages/Step1";
import Step2 from "../pages/Step2";
import Step3 from "../pages/Step3";
import ProfileReview from "../pages/ProfileReview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/step1" element={<Step1 />} />
        <Route path="/step2" element={<Step2 />} />
        <Route path="/step3" element={<Step3 />} />
        <Route path="/profile-review" element={<ProfileReview />} />
        {/* Optional: Catch-all route */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
