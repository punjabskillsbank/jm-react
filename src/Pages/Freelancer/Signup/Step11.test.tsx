/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useSignup } from "./SignupContext";
import Step11 from "./Step11_ABC_Member";

jest.mock("./SignupContext", () => ({
    useSignup: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

describe("Step11 Component", () => {
    const mockNavigate = jest.fn();
    const mockUpdateSignupData = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useSignup as jest.Mock).mockReturnValue({
            signupData: { abcMembership: "" },
            updateSignupData: mockUpdateSignupData,
        });
        (require("react-router-dom").useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    it("renders the component correctly", () => {
        render(
            <MemoryRouter>
                <Step11 />
            </MemoryRouter>
        );

        expect(screen.getByText("7/10 - Are you an ABC Member?")).toBeInTheDocument();
        expect(screen.getByText("Yes, I am an ABC Member")).toBeInTheDocument();
        expect(screen.getByText("No, I want to join")).toBeInTheDocument();
        expect(screen.getByText("Back")).toBeInTheDocument();
        expect(screen.getByText("Next, Add Overview")).toBeInTheDocument();
    });

    it("handles radio button selection", () => {
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

    it("disables the Next button when no option is selected", () => {
        render(
            <MemoryRouter>
                <Step11 />
            </MemoryRouter>
        );

        const nextButton = screen.getByText("Next, Add Overview");
        expect(nextButton).toBeDisabled();
    });

    it("enables the Next button when an option is selected", () => {
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

    it("navigates to the previous step when Back button is clicked", () => {
        render(
            <MemoryRouter>
                <Step11 />
            </MemoryRouter>
        );

        const backButton = screen.getByText("Back");
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith("/signup/step10");
    });

    it("updates signup data and navigates to the next step when Next button is clicked", () => {
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