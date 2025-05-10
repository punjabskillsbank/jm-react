import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Step1 from "./Step01_Client-Freelancer";
import { SignupProvider } from "./SignupContext";
import { useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock the useNavigate hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

test("renders Step1 and displays the correct buttons", () => {
  render(
    <MemoryRouter>
      <SignupProvider>
        <Step1 />
      </SignupProvider>
    </MemoryRouter>
  );

  // Check if the role selection buttons are displayed
  const clientButton = screen.getByText(/I’m a client, hiring for a project/i);
  const freelancerButton = screen.getByText(/I’m a freelancer, looking for work/i);

  expect(clientButton).toBeInTheDocument();
  expect(freelancerButton).toBeInTheDocument();
});

test("role selection updates the selected role and styles", () => {
  render(
    <MemoryRouter>
      <SignupProvider>
        <Step1 />
      </SignupProvider>
    </MemoryRouter>
  );

  const clientButton = screen.getByText(/I’m a client, hiring for a project/i);
  const freelancerButton = screen.getByText(/I’m a freelancer, looking for work/i);

  // Initially no button should be selected
  expect(clientButton).not.toHaveClass("border-2");
  expect(freelancerButton).not.toHaveClass("border-2");

  // Select 'client' role
  fireEvent.click(clientButton);

  // Check if the 'client' button is now selected
  expect(clientButton).toHaveClass("border-2 border-black");
  expect(freelancerButton).not.toHaveClass("border-2");

  // Select 'freelancer' role
  fireEvent.click(freelancerButton);

  // Check if the 'freelancer' button is now selected
  expect(freelancerButton).toHaveClass("border-2 border-black");
  expect(clientButton).not.toHaveClass("border-2");
});

test("submit button is disabled until a role is selected", () => {
  render(
    <MemoryRouter>
      <SignupProvider>
        <Step1 />
      </SignupProvider>
    </MemoryRouter>
  );

  const submitButton = screen.getByRole("button", { name: /Create Account/i });

  // Initially, the submit button should be disabled
  expect(submitButton).toBeDisabled();

  // Select 'client' role
  const clientButton = screen.getByText(/I’m a client, hiring for a project/i);
  fireEvent.click(clientButton);

  // After selecting a role, the submit button should be enabled
  expect(submitButton).not.toBeDisabled();
});

test("navigates to the next step on submit with a selected role", async () => {
  const navigateMock = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(navigateMock);

  render(
    <MemoryRouter>
      <SignupProvider>
        <Step1 />
      </SignupProvider>
    </MemoryRouter>
  );

  const clientButton = screen.getByText(/I’m a client, hiring for a project/i);
  const submitButton = screen.getByRole("button", { name: /Create Account/i });

  // Select 'client' role
  fireEvent.click(clientButton);

  // Click submit
  fireEvent.click(submitButton);

  await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/signup/step2"));
});

test("displays the login link", () => {
  render(
    <MemoryRouter>
      <SignupProvider>
        <Step1 />
      </SignupProvider>
    </MemoryRouter>
  );

  const loginLink = screen.getByText(/Log In/i);
  expect(loginLink).toBeInTheDocument();
  expect(loginLink).toHaveAttribute("href", "/login");
});
