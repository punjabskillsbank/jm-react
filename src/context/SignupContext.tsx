import React, { createContext, useContext, useState } from "react";

// Define the type for signup data
interface SignupData {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  skills?: string[];
  experience?: string;
  isAbcMember?: boolean;
  dob?: string;
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  photo?: File | null;
  hourlyRate?: number;
  education?: string; // ✅ Added Education Field
  [key: string]: unknown;
}

// Define the type for context
interface SignupContextType {
  signupData: SignupData;
  updateSignupData: (newData: Partial<SignupData>) => void;
}

// Create context with default values
const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signupData, setSignupData] = useState<SignupData>({});

  const updateSignupData = (newData: Partial<SignupData>) => {
    setSignupData((prev) => {
      const updatedData = { ...prev, ...newData };

      // Automatically update full name if first and last names are provided
      if (updatedData.firstName && updatedData.lastName) {
        updatedData.name = `${updatedData.firstName} ${updatedData.lastName}`;
      }

      return updatedData;
    });
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
