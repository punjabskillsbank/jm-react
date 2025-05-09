/* eslint-disable @typescript-eslint/no-require-imports */
import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useSignup } from "./SignupContext";
import Step7 from "./Step07_Title";

jest.mock("./SignupContext", () => ({
    useSignup: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

describe("Step7 Component", () => {
    const mockNavigate = jest.fn();
    const mockUpdateSignupData = jest.fn();

    beforeEach(() => {
        (useSignup as jest.Mock).mockReturnValue({
            signupData: { title: "" },
            updateSignupData: mockUpdateSignupData,
        });
        (require("react-router-dom").useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders the component correctly", () => {
        render(
            <MemoryRouter>
                <Step7 />
            </MemoryRouter>
        );

        expect(screen.getByText("3/10")).toBeInTheDocument();
        expect(screen.getByText("Add Your Title")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Creative Head")).toBeInTheDocument();
        expect(screen.getByText("Back")).toBeInTheDocument();
        expect(screen.getByText("Next, Add Your Experience")).toBeInTheDocument();
    });

    it("updates the title state when input changes", () => {
        render(
            <MemoryRouter>
                <Step7 />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText("Creative Head") as HTMLInputElement;
        fireEvent.change(input, { target: { value: "Software Engineer" } });

        expect(input.value).toBe("Software Engineer");
    });

    it("navigates to the previous step when 'Back' button is clicked", () => {
        render(
            <MemoryRouter>
                <Step7 />
            </MemoryRouter>
        );

        const backButton = screen.getByText("Back");
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith("/signup/step6");
    });

    it("updates signup data and navigates to the next step when 'Next' button is clicked", () => {
        render(
            <MemoryRouter>
                <Step7 />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText("Creative Head") as HTMLInputElement;
        fireEvent.change(input, { target: { value: "Software Engineer" } });

        const nextButton = screen.getByText("Next, Add Your Experience");
        fireEvent.click(nextButton);

        expect(mockUpdateSignupData).toHaveBeenCalledWith({ title: "Software Engineer" });
        expect(mockNavigate).toHaveBeenCalledWith("/signup/step8");
    });
});