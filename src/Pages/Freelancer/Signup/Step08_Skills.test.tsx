/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useSignup } from "./SignupContext";
import Step8 from "./Step08_Skills";
import '@testing-library/jest-dom';

jest.mock("./SignupContext", () => ({
    useSignup: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

describe("Step8 Component", () => {
    const mockNavigate = jest.fn();
    const mockUpdateSignupData = jest.fn();

    beforeEach(() => {
        (useSignup as jest.Mock).mockReturnValue({
            signupData: { skills: ["Illustration"] },
            updateSignupData: mockUpdateSignupData,
        });
        require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders the component correctly", () => {
        render(
            <MemoryRouter>
                <Step8 />
            </MemoryRouter>
        );

        expect(screen.getByText("4/10")).toBeInTheDocument();
        expect(screen.getByText("Nearly there!")).toBeInTheDocument();
        expect(screen.getByText("Your Skills (Max 15)")).toBeInTheDocument();
        expect(screen.getByText("Suggested Skills")).toBeInTheDocument();
    });

    it("displays selected skills", () => {
        render(
            <MemoryRouter>
                <Step8 />
            </MemoryRouter>
        );

        expect(screen.getByText("Illustration ✖")).toBeInTheDocument();
    });

    it("toggles skill selection", () => {
        render(
            <MemoryRouter>
                <Step8 />
            </MemoryRouter>
        );

        const skillButton = screen.getByText("Brand Development");
        fireEvent.click(skillButton);

        expect(screen.getByText("Brand Development ✖")).toBeInTheDocument();

        fireEvent.click(skillButton);
        expect(screen.queryByText("Brand Development ✖")).not.toBeInTheDocument();
    });

    it("limits skill selection to 15", () => {
        const manySkills = Array.from({ length: 15 }, (_, i) => `Skill ${i + 1}`);
        (useSignup as jest.Mock).mockReturnValue({
            signupData: { skills: manySkills },
            updateSignupData: mockUpdateSignupData,
        });

        render(
            <MemoryRouter>
                <Step8 />
            </MemoryRouter>
        );

        const skillButton = screen.getByText("Brand Development");
        fireEvent.click(skillButton);

        expect(screen.queryByText("Brand Development ✖")).not.toBeInTheDocument();
    });

    it("navigates to the previous step on 'Back' button click", () => {
        render(
            <MemoryRouter>
                <Step8 />
            </MemoryRouter>
        );

        const backButton = screen.getByText("Back");
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith("/signup/step7");
    });

    it("updates signup data and navigates to the next step on 'Next' button click", () => {
        render(
            <MemoryRouter>
                <Step8 />
            </MemoryRouter>
        );

        const nextButton = screen.getByText("Next");
        fireEvent.click(nextButton);

        expect(mockUpdateSignupData).toHaveBeenCalledWith({
            skills: ["Illustration"],
        });
        expect(mockNavigate).toHaveBeenCalledWith("/signup/step9");
    });
});