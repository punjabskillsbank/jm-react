import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { useSignup } from "./SignupContext";
import Step6 from "./Step06_Work_Category";

// Mocks
jest.mock("./SignupContext", () => ({
  useSignup: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Step6 Component", () => {
  const mockNavigate = jest.fn();
  const mockUpdateSignupData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSignup as jest.Mock).mockReturnValue({
      signupData: { workCategories: "" },
      updateSignupData: mockUpdateSignupData,
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("renders the component correctly", () => {
    render(
      <MemoryRouter>
        <Step6 />
      </MemoryRouter>
    );

    expect(screen.getByText("2/10")).toBeInTheDocument();
    expect(screen.getByText("What kind of work are you here to do?")).toBeInTheDocument();
    expect(screen.getByText("Don't worry, you can change this choice later on.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });

  it("renders all hardcoded category buttons", () => {
    render(
      <MemoryRouter>
        <Step6 />
      </MemoryRouter>
    );

    const expectedCategories = [
      "Accounting & Consulting",
      "Admin Support",
      "Customer Service",
      "Data Science & Analytics",
      "Design & Creative",
      "Engineering & Architecture",
      "IT & Networking",
      "Legal",
      "Sales & Marketing",
      "Translation",
      "Web, Mobile & Software Dev",
      "Writing",
    ];

    expectedCategories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it("disables the Next button when no category is selected", () => {
    render(
      <MemoryRouter>
        <Step6 />
      </MemoryRouter>
    );

    const nextButton = screen.getByRole("button", { name: /Next/i });
    expect(nextButton).toBeDisabled();
  });

  it("enables the Next button when a category is selected", () => {
    render(
      <MemoryRouter>
        <Step6 />
      </MemoryRouter>
    );

    const categoryButton = screen.getByText("Accounting & Consulting");
    fireEvent.click(categoryButton);

    const nextButton = screen.getByRole("button", { name: /Next/i });
    expect(nextButton).not.toBeDisabled();
  });

  it("calls updateSignupData and navigates to the next step when Next is clicked", () => {
    render(
      <MemoryRouter>
        <Step6 />
      </MemoryRouter>
    );

    const categoryButton = screen.getByText("Accounting & Consulting");
    fireEvent.click(categoryButton);

    const nextButton = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextButton);

    expect(mockUpdateSignupData).toHaveBeenCalledWith({ workCategories: "Accounting & Consulting" });
    expect(mockNavigate).toHaveBeenCalledWith("/signup/step7");
  });

  it("navigates to the previous step when Back is clicked", () => {
    render(
      <MemoryRouter>
        <Step6 />
      </MemoryRouter>
    );

    const backButton = screen.getByRole("button", { name: /Back/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/signup/step5");
  });

  it("highlights the selected category button", () => {
    render(
      <MemoryRouter>
        <Step6 />
      </MemoryRouter>
    );

    const categoryButton = screen.getByText("Accounting & Consulting");
    fireEvent.click(categoryButton);

    expect(categoryButton).toHaveClass("bg-green-600 text-white");
  });
});
