import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Step3 from './Step03_Experience';
import { useSignup } from './SignupContext';
import { MemoryRouter } from 'react-router-dom';

// Mocks
jest.mock('./SignupContext', () => ({
  useSignup: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Step3 - Experience Level Selection', () => {
  const mockUpdateSignupData = jest.fn();

  beforeEach(() => {
    (useSignup as jest.Mock).mockReturnValue({
      signupData: {},
      updateSignupData: mockUpdateSignupData,
    });
    mockNavigate.mockReset();
  });

  function renderStep() {
    return render(<Step3 />, { wrapper: MemoryRouter });
  }

  test('renders all experience options', () => {
    renderStep();

    expect(screen.getByText(/I am brand new to this/i)).toBeInTheDocument();
    expect(screen.getByText(/I have some experience/i)).toBeInTheDocument();
    expect(screen.getByText(/I am an expert/i)).toBeInTheDocument();
    expect(screen.getByText(/I am a pro/i)).toBeInTheDocument();
  });

  test('clicking an option updates the selected state', async () => {
    renderStep();
    const button = screen.getByText(/I am an expert/i);
    await userEvent.click(button);

    expect(button).toHaveClass('border-black');
  });

  test('clicking Next with a selected option updates data and navigates', async () => {
    renderStep();
    const button = screen.getByText(/I have some experience/i);
    await userEvent.click(button);

    await userEvent.click(screen.getByText(/Next/i));

    expect(mockUpdateSignupData).toHaveBeenCalledWith({ experienceLevel: 'some_experience' });
    expect(mockNavigate).toHaveBeenCalledWith('/signup/step4');
  });

  test('clicking Next without selecting option shows alert', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderStep();

    await userEvent.click(screen.getByText(/Next/i));

    expect(alertSpy).toHaveBeenCalledWith('Please select an option before proceeding.');
    alertSpy.mockRestore();
  });

  test('clicking Back navigates to step 2', async () => {
    renderStep();
    await userEvent.click(screen.getByText(/Back/i));
    expect(mockNavigate).toHaveBeenCalledWith('/signup/step2');
  });
});
