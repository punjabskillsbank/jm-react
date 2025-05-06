import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Step12 from "./Step12_Bio";

jest.mock("./SignupContext", () => ({
    useSignup: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));

const mockNavigate = jest.requireMock("react-router-dom").useNavigate;
const mockUseSignup = jest.requireMock("./SignupContext").useSignup;

describe("Step12 Component", () => {
    const mockUpdateSignupData = jest.fn();
    const mockSignupData = { bio: "" };

    beforeEach(() => {
        mockUseSignup.mockReturnValue({
            signupData: mockSignupData,
            updateSignupData: mockUpdateSignupData,
        });
        mockNavigate.mockReturnValue(jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders the component correctly", () => {
        render(
            <MemoryRouter>
                <Step12 />
            </MemoryRouter>
        );

        expect(screen.getByText("8/10 - Write Your Bio")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your bio here...")).toBeInTheDocument();
        expect(screen.getByText("0 / 500 characters")).toBeInTheDocument();
        expect(screen.getByText("Back")).toBeInTheDocument();
        expect(screen.getByText("Next, Add Your Rate")).toBeInTheDocument();
    });

    it("updates the bio as the user types", () => {
        render(
            <MemoryRouter>
                <Step12 />
            </MemoryRouter>
        );

        const textarea = screen.getByPlaceholderText("Enter your bio here...");
        fireEvent.change(textarea, { target: { value: "This is my bio." } });

        expect(textarea).toHaveValue("This is my bio.");
        expect(screen.getByText("15 / 500 characters")).toBeInTheDocument();
    });

    it("disables the Next button if bio is less than 500 characters", () => {
        render(
            <MemoryRouter>
                <Step12 />
            </MemoryRouter>
        );

        const nextButton = screen.getByText("Next, Add Your Rate");
        expect(nextButton).toBeDisabled();
    });

    it("enables the Next button if bio is at least 500 characters", () => {
        render(
            <MemoryRouter>
                <Step12 />
            </MemoryRouter>
        );

        const textarea = screen.getByPlaceholderText("Enter your bio here...");
        fireEvent.change(textarea, { target: { value: "a".repeat(500) } });

        const nextButton = screen.getByText("Next, Add Your Rate");
        expect(nextButton).not.toBeDisabled();
    });

    it("navigates to the previous step when Back button is clicked", () => {
        const navigateMock = jest.fn();
        mockNavigate.mockReturnValue(navigateMock);

        render(
            <MemoryRouter>
                <Step12 />
            </MemoryRouter>
        );

        const backButton = screen.getByText("Back");
        fireEvent.click(backButton);

        expect(navigateMock).toHaveBeenCalledWith("/signup/step11");
    });

    it("updates signup data and navigates to the next step when Next button is clicked", () => {
        const navigateMock = jest.fn();
        mockNavigate.mockReturnValue(navigateMock);

        render(
            <MemoryRouter>
                <Step12 />
            </MemoryRouter>
        );

        const textarea = screen.getByPlaceholderText("Enter your bio here...");
        fireEvent.change(textarea, { target: { value: "a".repeat(500) } });

        const nextButton = screen.getByText("Next, Add Your Rate");
        fireEvent.click(nextButton);

        expect(mockUpdateSignupData).toHaveBeenCalledWith({ bio: "a".repeat(500) });
        expect(navigateMock).toHaveBeenCalledWith("/signup/step13");
    });
});