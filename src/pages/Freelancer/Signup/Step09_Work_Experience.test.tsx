import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Step9 from "./Step09_Work_Experience"; // adjust import path as needed
import { SignupProvider } from "./SignupContext"; // wrap with context
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';
// Utility to render Step9 with required wrappers
const renderWithProviders = () =>
render(
<BrowserRouter>
<SignupProvider>
<Step9 />
</SignupProvider>
</BrowserRouter>
);

describe("Step9 Component", () => {
test("renders Step9 with initial experience fields", () => {
renderWithProviders();
expect(screen.getByText("Add Your Work Experience")).toBeInTheDocument();
expect(screen.getByLabelText("Title")).toBeInTheDocument();
expect(screen.getByLabelText("Description")).toBeInTheDocument();
expect(screen.getByLabelText("Budget Type")).toBeInTheDocument();
expect(screen.getByLabelText("Fixed Price")).toBeInTheDocument();
expect(screen.getByLabelText("Project Duration")).toBeInTheDocument();
expect(screen.getByLabelText("Experience Level")).toBeInTheDocument();
});

test("can fill and change budget type to hourly", () => {
renderWithProviders();

fireEvent.change(screen.getByLabelText("Title"), { target: { value: "React Developer" } });
fireEvent.change(screen.getByLabelText("Budget Type"), { target: { value: "hourly" } });

// Should now show hourly rate fields
expect(screen.getByLabelText("Hourly Min Rate")).toBeInTheDocument();
expect(screen.getByLabelText("Hourly Max Rate")).toBeInTheDocument();

fireEvent.change(screen.getByLabelText("Hourly Min Rate"), { target: { value: "10" } });
fireEvent.change(screen.getByLabelText("Hourly Max Rate"), { target: { value: "20" } });
});

test("adds and removes experience blocks", () => {
renderWithProviders();

const addButton = screen.getByText(/Add Another Experience/i);
fireEvent.click(addButton);

// Two sets of Title fields should exist
const titleFields = screen.getAllByLabelText("Title");
expect(titleFields.length).toBe(2);

// Remove one
const removeButtons = screen.getAllByText("Remove This Experience");
fireEvent.click(removeButtons[0]);

expect(screen.getAllByLabelText("Title").length).toBe(1);
});

test("clicks skip and next buttons", () => {
renderWithProviders();

const skipButton = screen.getByText("Skip for Now");
const nextButton = screen.getByText("Next");

fireEvent.click(skipButton);
fireEvent.click(nextButton);

// No assertion here — just verifying buttons exist and are clickable
expect(skipButton).toBeEnabled();
expect(nextButton).toBeEnabled();
});
});