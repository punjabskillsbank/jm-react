/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

interface SignupData {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  skills?: string[];
  experience?: {
    title: string;
    description: string;
    budget_type: "fixed" | "hourly";
    fixed_price: string;
    hourly_min_rate: string;
    hourly_max_rate: string;
    project_duration: string;
    experience_level: "beginner" | "intermediate" | "expert";
  }[];  
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
  education?: {
    institute: string;
    degree: string;
    start_year: string;
    end_year: string;
    description: string;
  }[];  
  title?: string;
  bio?: string;
  timezone?: string;
  profileStatus?: string;
  certificate?: {
  certificateName: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  credentialUrl: string;
}[];
  [key: string]: unknown;
}

// Define the context type
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

       if ("abcMembership" in newData) {
      updatedData.isAbcMember = newData.abcMembership === "yes";
      delete updatedData.abcMembership; // Optional cleanup
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
