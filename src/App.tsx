// src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "../src/Pages/Client/AuthContext"; 
import { SignupProvider } from "./pages/Freelancer/Signup/SignupContext";
import AppRoutes from "./router/AppRoutes";
import './index.css';
import { initMockUser } from "./utils/initUser";

function App() {
  useEffect(() => {
    initMockUser();
  }, []);

  return (
    <SignupProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </SignupProvider>
  );
}

export default App;
