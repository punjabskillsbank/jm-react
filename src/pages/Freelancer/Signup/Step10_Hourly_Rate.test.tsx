import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Step10 from './Step10_Hourly_Rate';
import { SignupProvider } from './SignupContext';
import '@testing-library/jest-dom';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Step10 - Hourly Rate Step', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockNavigate.mockReset();
  });

  const renderWithProvider = () => {
    return render(
      <MemoryRouter>
        <SignupProvider>
          <Step10 />
        </SignupProvider>
      </MemoryRouter>
    );
  };

  it('renders hourly rate input with default value', () => {
    renderWithProvider();
    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(30);
  });

  it('updates hourly rate as user types', () => {
    renderWithProvider();
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '50' } });
    expect(input).toHaveValue(50);
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('navigates to next step and updates context on Next', async () => {
    renderWithProvider();
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '60' } });

    const nextButton = screen.getByRole('button', { name: /^Next$/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/signup/step11');
    });
  });

  it('navigates to previous step on Back', async () => {
    renderWithProvider();
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/signup/step9');
    });
  });
});
