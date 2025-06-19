import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import ProfileReview from "../../../pages/Freelancer/Profile/ProfileReview";
import { SignupProvider } from "../../../pages/Freelancer/Signup/SignupContext";
import config from "../../../config/indexConfig";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ProfileReview Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock localStorage.getItem to return "mock-user-123" for user_id by default
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "user_id") return "mock-user-123";
      return null;
    });

    // Mock window.alert
    window.alert = jest.fn();
  });

  test("publishes profile successfully on button click", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { message: "Success" },
    });

    render(
      <BrowserRouter>
        <SignupProvider>
          <ProfileReview />
        </SignupProvider>
      </BrowserRouter>
    );

    const publishButton = screen.getByRole("button", { name: /publish profile/i });
    fireEvent.click(publishButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });

    const calledUrl = mockedAxios.post.mock.calls[0][0];
    type PayloadType = { freelancerId: string; name: string; [key: string]: unknown };
    const calledPayload = mockedAxios.post.mock.calls[0][1] as PayloadType;

    expect(calledUrl).toBe(config.baseURLs.users + config.endpoints.createFreelancerProfile);
    expect(calledPayload.freelancerId).toBe("mock-user-123");
    expect(calledPayload.name).toBeDefined();

    expect(window.alert).toHaveBeenCalledWith("Profile published successfully!");
  });

  test("shows alert and does not submit if no user_id in localStorage", () => {
    // Override localStorage.getItem to simulate missing user_id
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "user_id") return null;
      return null;
    });

    render(
      <BrowserRouter>
        <SignupProvider>
          <ProfileReview />
        </SignupProvider>
      </BrowserRouter>
    );

    const publishButton = screen.getByRole("button", { name: /publish profile/i });
    fireEvent.click(publishButton);

    expect(window.alert).toHaveBeenCalledWith("User ID not found in localStorage.");
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });
});
