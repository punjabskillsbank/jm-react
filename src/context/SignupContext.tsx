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
  education?: string;
  title?: string;
  bio?: string;
  timezone?: string;
  profileStatus?: string;
  [key: string]: unknown;
}

// Define the type for context
interface SignupContextType {
  signupData: SignupData;
  updateSignupData: (newData: Partial<SignupData>) => void;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signupData, setSignupData] = useState<SignupData>({});

  const updateSignupData = (newData: Partial<SignupData>) => {
    setSignupData((prev) => {
      const updatedData = { ...prev, ...newData };

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

export const useSignup = (): SignupContextType => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
};
