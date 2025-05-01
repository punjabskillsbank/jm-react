import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfileReview from "./ProfileReview";
import { useSignup } from "../Signup/SignupContext";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Mocks
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));
jest.mock("./src/context/SignupContext", () => ({
  useSignup: jest.fn(),
}));

// Mock alert
beforeAll(() => {
  window.alert = jest.fn();
});

// Helpers
const mockSignupData = {
  title: "Frontend Developer",
  bio: "Experienced with React and TypeScript.",
  email: "freelancer@example.com",
  phone: "9876543210",
  country: "India",
  abcMembership: "yes",
  address: "123 Lane",
  city: "Ludhiana",
  state: "Punjab",
  zip: "141001",
  hourlyRate: "30",
  photo: null,
};

const renderComponent = () => render(
  <BrowserRouter>
    <ProfileReview />
  </BrowserRouter>
);

// Tests
describe("ProfileReview Page", () => {
  beforeEach(() => {
    (useSignup as jest.Mock).mockReturnValue({ signupData: mockSignupData });

    localStorage.setItem("user_id", "freelancer-id-1");
    (axios.post as jest.Mock).mockResolvedValue({ data: { message: "Success" } });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders profile review content", () => {
    renderComponent();

    expect(screen.getByText("🎉 Profile Review")).toBeInTheDocument();
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
        "http://localhost:8081/api/freelancer/create_profile",
        expect.objectContaining({
          freelancerId: "freelancer-id-1",
          title: "Frontend Developer",
          profileStatus: "PENDING",
        }),
        expect.any(Object)
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
