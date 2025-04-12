// src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import { SignupProvider } from "./context/SignupContext";
import AppRoutes from "./router/AppRoutes";
import './index.css';


function App() {
  return (

    <SignupProvider>
     
      <Router>
        <AppRoutes />
      </Router>
    </SignupProvider>
  );
}

export default App;
