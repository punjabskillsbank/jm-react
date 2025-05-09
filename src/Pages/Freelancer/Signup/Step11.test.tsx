
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Step11 from "./Step11_ABC_Member";

// Mock update function
const mockUpdateSignupData = jest.fn();

// Mock context hook
jest.mock("./SignupContext", () => ({
  useSignup: () => ({
    signupData: { abcMembership: "" },
    updateSignupData: mockUpdateSignupData,
  }),
}));

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Step11 Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all expected elements", () => {
    render(
      <MemoryRouter>
        <Step11 />
      </MemoryRouter>
    );

    expect(screen.getByText("7/10 - Are you an ABC Member?")).toBeInTheDocument();
    expect(screen.getByLabelText("Yes, I am an ABC Member")).toBeInTheDocument();
    expect(screen.getByLabelText("No, I want to join")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Next, Add Overview")).toBeInTheDocument();
  });

  it("handles radio selection correctly", () => {
    render(
      <MemoryRouter>
        <Step11 />
      </MemoryRouter>
    );

    const yesRadio = screen.getByLabelText("Yes, I am an ABC Member");
    const noRadio = screen.getByLabelText("No, I want to join");

    fireEvent.click(yesRadio);
    expect(yesRadio).toBeChecked();
    expect(noRadio).not.toBeChecked();

    fireEvent.click(noRadio);
    expect(noRadio).toBeChecked();
    expect(yesRadio).not.toBeChecked();
  });

  it("disables Next button when no selection is made", () => {
    render(
      <MemoryRouter>
        <Step11 />
      </MemoryRouter>
    );

    const nextButton = screen.getByText("Next, Add Overview");
    expect(nextButton).toBeDisabled();
  });

  it("enables Next button after selection", () => {
    render(
      <MemoryRouter>
        <Step11 />
      </MemoryRouter>
    );

    const yesRadio = screen.getByLabelText("Yes, I am an ABC Member");
    const nextButton = screen.getByText("Next, Add Overview");

    fireEvent.click(yesRadio);
    expect(nextButton).not.toBeDisabled();
  });

  it("goes back on Back button click", () => {
    render(
      <MemoryRouter>
        <Step11 />
      </MemoryRouter>
    );

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/signup/step10");
  });

  it("saves data and proceeds on Next button click", () => {
    render(
      <MemoryRouter>
        <Step11 />
      </MemoryRouter>
    );

    const yesRadio = screen.getByLabelText("Yes, I am an ABC Member");
    const nextButton = screen.getByText("Next, Add Overview");

    fireEvent.click(yesRadio);
    fireEvent.click(nextButton);

    expect(mockUpdateSignupData).toHaveBeenCalledWith({ abcMembership: "yes" });
    expect(mockNavigate).toHaveBeenCalledWith("/signup/step12");
  });
});
