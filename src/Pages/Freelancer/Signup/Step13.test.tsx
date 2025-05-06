/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useSignup } from "./SignupContext";
import Step13 from "./Step13_Details";

jest.mock("./SignupContext", () => ({
    useSignup: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

describe("Step13 Component", () => {
    const mockNavigate = jest.fn();
    const mockUpdateSignupData = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useSignup as jest.Mock).mockReturnValue({
            signupData: {
                dob: "",
                country: "",
                address: "",
                city: "",
                state: "",
                zip: "",
                phone: "",
            },
            updateSignupData: mockUpdateSignupData,
        });
        require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    });

    it("renders the component correctly", () => {
        render(
            <MemoryRouter>
                <Step13 />
            </MemoryRouter>
        );

        expect(screen.getByText("10/10 - Final Details")).toBeInTheDocument();
        expect(screen.getByText("Upload Photo")).toBeInTheDocument();
        expect(screen.getByText("Date of Birth")).toBeInTheDocument();
        expect(screen.getByText("Country")).toBeInTheDocument();
    });

    it("validates the form and shows errors when fields are empty", () => {
        render(
            <MemoryRouter>
                <Step13 />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Review Your Profile"));

        expect(screen.getByText("Date of birth is required")).toBeInTheDocument();
        expect(screen.getByText("Country is required")).toBeInTheDocument();
        expect(screen.getByText("Street address is required")).toBeInTheDocument();
        expect(screen.getByText("City is required")).toBeInTheDocument();
        expect(screen.getByText("State/Province is required")).toBeInTheDocument();
        expect(screen.getByText("ZIP/Postal Code is required")).toBeInTheDocument();
        expect(screen.getByText("Phone number is required")).toBeInTheDocument();
        expect(screen.getByText("Profile photo is required")).toBeInTheDocument();
    });

    it("navigates to the previous step when 'Back' is clicked", () => {
        render(
            <MemoryRouter>
                <Step13 />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Back"));

        expect(mockNavigate).toHaveBeenCalledWith("/signup/step12");
    });

    it("updates signup data and navigates to the next step when form is valid", () => {
        render(
            <MemoryRouter>
                <Step13 />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText("Date of Birth"), { target: { value: "1990-01-01" } });
        fireEvent.change(screen.getByLabelText("Country"), { target: { value: "India" } });
        fireEvent.change(screen.getByLabelText("Street Address"), { target: { value: "123 Street" } });
        fireEvent.change(screen.getByLabelText("City"), { target: { value: "Mumbai" } });
        fireEvent.change(screen.getByLabelText("State/Province"), { target: { value: "Maharashtra" } });
        fireEvent.change(screen.getByLabelText("Postal Code"), { target: { value: "400001" } });
        fireEvent.change(screen.getByLabelText("Phone Number"), { target: { value: "1234567890" } });

        const file = new File(["photo"], "photo.png", { type: "image/png" });
        fireEvent.change(screen.getByLabelText("Upload Photo"), { target: { files: [file] } });

        fireEvent.click(screen.getByText("Review Your Profile"));

        expect(mockUpdateSignupData).toHaveBeenCalledWith({
            dob: "1990-01-01",
            country: "India",
            address: "123 Street",
            city: "Mumbai",
            state: "Maharashtra",
            zip: "400001",
            phone: "1234567890",
            photo: file,
        });
        expect(mockNavigate).toHaveBeenCalledWith("/signup/profile-review");
    });
});