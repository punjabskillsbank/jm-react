import React, { createContext, useContext, useState } from "react";

// Define the type for signup data
interface SignupData {
  name?: string;
  email?: string;
  password?: string;
  [key: string]: string | number | boolean | undefined; // Allow dynamic keys with specific types
}

// Define the type for context
interface SignupContextType {
  signupData: SignupData; // ✅ Define signupData
  updateSignupData: (newData: SignupData) => void; // ✅ Define update function
}

// Create context with default values
const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signupData, setSignupData] = useState<SignupData>({});

  const updateSignupData = (newData: SignupData) => {
    setSignupData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <SignupContext.Provider value={{ signupData, updateSignupData }}>
      {children}
    </SignupContext.Provider>
  );
};

// Hook to use Signup Context
export const useSignup = (): SignupContextType => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
};
