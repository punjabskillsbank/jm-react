import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Step14 from "./Step14_Certificates";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';
// Mocking useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useSignup context
const mockUpdateSignupData = jest.fn();
const mockSignupData = {
  certificate: [
    {
      certificateName: "React Certification",
      issuedBy: "Meta",
      issueDate: "2023-01-01",
      expiryDate: "2025-01-01",
      credentialUrl: "https://example.com/cert",
    },
  ],
};

jest.mock("../Signup/SignupContext", () => ({
  useSignup: () => ({
    signupData: mockSignupData,
    updateSignupData: mockUpdateSignupData,
  }),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Step14 Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders certificate fields correctly", () => {
    renderWithRouter(<Step14 />);
    expect(screen.getByPlaceholderText("Certificate Name")).toHaveValue("React Certification");
    expect(screen.getByPlaceholderText("Issued By")).toHaveValue("Meta");
    expect(screen.getByPlaceholderText("Credential URL")).toHaveValue("https://example.com/cert");
  });

  it("adds a new certificate entry on button click", () => {
    renderWithRouter(<Step14 />);
    fireEvent.click(screen.getByText("Add Certificate"));
    expect(mockUpdateSignupData).toHaveBeenCalledWith(
      expect.objectContaining({ certificate: expect.any(Array) })
    );
    expect(screen.getAllByPlaceholderText("Certificate Name")).toHaveLength(2);
  });

  it("updates certificate fields on input change", () => {
    renderWithRouter(<Step14 />);
    const input = screen.getByPlaceholderText("Certificate Name");
    fireEvent.change(input, { target: { value: "Updated Cert" } });
    expect(mockUpdateSignupData).toHaveBeenCalledWith(
      expect.objectContaining({
        certificate: expect.arrayContaining([
          expect.objectContaining({ certificateName: "Updated Cert" }),
        ]),
      })
    );
  });

  it("navigates to next step on Next button click", () => {
    renderWithRouter(<Step14 />);
    fireEvent.click(screen.getByText("Next"));
    expect(mockUpdateSignupData).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/signup/step15");
  });

  it("navigates to previous step on Back button click", () => {
    renderWithRouter(<Step14 />);
    fireEvent.click(screen.getByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith("/signup/step13");
  });
});
