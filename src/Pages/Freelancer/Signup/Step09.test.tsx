/* eslint-disable @typescript-eslint/no-require-imports */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useSignup } from "./SignupContext";
import Step9 from "./Step09_Work_Experience";

jest.mock("./SignupContext", () => ({
    useSignup: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

describe("Step9 Component", () => {
    const mockUpdateSignupData = jest.fn();
    const mockNavigate = jest.fn();

    beforeEach(() => {
        (useSignup as jest.Mock).mockReturnValue({
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
                <Step9 />
            </MemoryRouter>
        );

        expect(screen.getByText("Add Your Work Experience")).toBeInTheDocument();
        expect(screen.getByText("Add multiple past projects you've worked on. This helps clients trust your skills.")).toBeInTheDocument();
        expect(screen.getByText("+ Add Another Experience")).toBeInTheDocument();
        expect(screen.getByText("Next, Add Your Education")).toBeInTheDocument();
    });

    it("adds a new experience when 'Add Another Experience' is clicked", () => {
        render(
            <MemoryRouter>
                <Step9 />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("+ Add Another Experience"));
        const experienceSections = screen.getAllByText("Title");
        expect(experienceSections).toHaveLength(2);
    });

    it("removes an experience when 'Remove This Experience' is clicked", () => {
        render(
            <MemoryRouter>
                <Step9 />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("+ Add Another Experience"));
        const removeButtons = screen.getAllByText("Remove This Experience");
        fireEvent.click(removeButtons[0]);

        const experienceSections = screen.getAllByText("Title");
        expect(experienceSections).toHaveLength(1);
    });

    it("updates experience fields correctly", () => {
        render(
            <MemoryRouter>
                <Step9 />
            </MemoryRouter>
        );

        const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
        fireEvent.change(titleInput, { target: { value: "New Project" } });

        expect(titleInput.value).toBe("New Project");
    });

    it("navigates to the next step when 'Next, Add Your Education' is clicked", () => {
        render(
            <MemoryRouter>
                <Step9 />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Next, Add Your Education"));
        expect(mockUpdateSignupData).toHaveBeenCalledWith({
            experience: expect.any(Array),
        });
        expect(mockNavigate).toHaveBeenCalledWith("/signup/step10");
    });

    it("navigates to the previous step when 'Skip for Now' is clicked", () => {
        render(
            <MemoryRouter>
                <Step9 />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Skip for Now"));
        expect(mockNavigate).toHaveBeenCalledWith("/signup/step8");
    });
});