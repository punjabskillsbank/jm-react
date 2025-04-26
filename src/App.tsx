// src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { SignupProvider } from "./Pages/Freelancer/SignupContext";
import AppRoutes from "./router/AppRoutes";
import './index.css';
import { initMockUser } from "./utils/initUser";



function App() {
  useEffect(() => {
    initMockUser();
  }, []);

  return (
    <SignupProvider>
      <Router>
        <AppRoutes />
      </Router>
    </SignupProvider>
  );
}

export default App;
