import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfileReview from "../../../pages/Freelancer/Profile/ProfileReview";
import { useSignup } from "../Signup/SignupContext";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { jest } from "@jest/globals";

// Mock axios and useNavigate
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as object),
  useNavigate: () => jest.fn(),
}));
jest.mock("../Signup/SignupContext", () => ({
  useSignup: jest.fn(),
}));

// Mock utility functions
jest.mock("../../../utils/initUser", () => ({
  getMockUserId: jest.fn(() => "freelancer-id-1"),
  initMockUser: jest.fn(),
}));

// Mock FontAwesome (optional, to avoid warnings)
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));

// Mock alert
beforeAll(() => {
  window.alert = jest.fn();
  window.URL.createObjectURL = jest.fn(() => "mock-url");
});

// Mock file
const mockFile = new File(["photo"], "profile.jpg", { type: "image/jpeg" });

// Sample signup data for testing
const mockSignupData = {
  name: "John Doe", 
  title: "Frontend Developer",
  bio: "Experienced with React and TypeScript.",
  email: "freelancer@example.com",
  phone: "9876543210",
  country: "India",
  isAbcMember: true,
  address: "123 Lane",
  city: "Ludhiana",
  state: "Punjab",
  zip: "141001",
  hourlyRate: 30,
  photo: mockFile,
};

// Render component with router context
const renderComponent = () =>
  render(
    <BrowserRouter>
      <ProfileReview />
    </BrowserRouter>
  );

describe("ProfileReview Page", () => {
  beforeEach(() => {
    // Mock signup context
    (useSignup as jest.Mock).mockReturnValue({ signupData: mockSignupData });

    // Mock localStorage and axios
    localStorage.setItem("user_id", "freelancer-id-1");

      // ✅ mock resolved axios structure
    (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValue({
    data: {
      freelancerDTO: { id: "freelancer-id-1" },
      presignedUrl: "https://mock-s3-url.com",
    },
  });

  (axios.put as jest.MockedFunction<typeof axios.put>).mockResolvedValue({ status: 200 });
});
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders profile review content", () => {
    renderComponent();

    expect(screen.getByText("Profile Review")).toBeInTheDocument();
    expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/India/i)).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
  });

  test("shows error when user_id is missing", async () => {
    localStorage.removeItem("user_id");
    renderComponent();

    const publishBtn = screen.getByRole("button", { name: /Publish Profile/i });
    fireEvent.click(publishBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("User ID not found in localStorage.");
    });
  });

  test("submits profile data with correct payload", async () => {
    renderComponent();

    const publishBtn = screen.getByRole("button", { name: /Publish Profile/i });
    fireEvent.click(publishBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("http://localhost:8080/api/freelancer/create_profile?contentType=image/jpeg"),
        expect.objectContaining({
          freelancerId: "freelancer-id-1",
          title: "Frontend Developer",
          profileStatus: "PENDING",
        }),
        expect.any(Object)
      );

       expect(axios.put).toHaveBeenCalledWith(
        "https://mock-s3-url.com",
        mockFile,
        expect.objectContaining({
          headers: expect.objectContaining({ "Content-Type": "image/jpeg" }),
        })
      );

    });

    expect(window.alert).toHaveBeenCalledWith("Profile published successfully!");
  });

  test("displays loading state on submit", async () => {
    renderComponent();

    const publishBtn = screen.getByRole("button", { name: /Publish Profile/i });
    fireEvent.click(publishBtn);

    expect(publishBtn).toHaveTextContent(/Publishing.../i);

    await waitFor(() => {
      expect(publishBtn).toHaveTextContent(/Publish Profile/i);
    });
  });
});
