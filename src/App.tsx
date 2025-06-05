// src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./pages/Auth/AuthContext"; 
import { SignupProvider } from "./pages/Freelancer/Signup/SignupContext";
import AppRoutes from "./router/AppRoutes";
import './index.css';
import { initMockUser } from "./utils/initUser";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  useEffect(() => {
    initMockUser();
  }, []);

  return (
    <SignupProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </AuthProvider>
    </SignupProvider>
  );
}

export default App;
