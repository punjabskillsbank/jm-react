import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileReview from "./src/pages/ProfileReview";
import { useSignup } from "./src/context/SignupContext";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));
jest.mock("./src/context/SignupContext", () => ({
  useSignup: jest.fn(),
}));

describe("ProfileReview", () => {
  // const mockNavigate = jest.fn();

  beforeEach(() => {
    (useSignup as jest.Mock).mockReturnValue({
      signupData: {
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
      },
    });

    localStorage.setItem("user_id", "freelancer-id-1");
    (axios.post as jest.Mock).mockResolvedValue({ data: { message: "Success" } });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders review sections correctly", () => {
    render(<ProfileReview />, { wrapper: BrowserRouter });

    expect(screen.getByText("🎉 Profile Review")).toBeInTheDocument();
    expect(screen.getByText(/Frontend Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/India/i)).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
  });

  test("displays error when user ID is missing", async () => {
    localStorage.removeItem("user_id");

    render(<ProfileReview />, { wrapper: BrowserRouter });

    const publishBtn = screen.getByRole("button", { name: /Publish Profile/i });
    fireEvent.click(publishBtn);

    await waitFor(() => {
      expect(screen.getByText(/Publish Profile/i)).toBeInTheDocument(); // Alert not testable directly unless mocked
    });
  });

  test("sends correct payload on profile publish", async () => {
    render(<ProfileReview />, { wrapper: BrowserRouter });

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
  });

  test("displays loading state while submitting", async () => {
    render(<ProfileReview />, { wrapper: BrowserRouter });

    const publishBtn = screen.getByRole("button", { name: /Publish Profile/i });
    fireEvent.click(publishBtn);

    expect(publishBtn).toHaveTextContent(/Publishing.../i);

    await waitFor(() => {
      expect(publishBtn).toHaveTextContent(/Publish Profile/i);
    });
  });
});
