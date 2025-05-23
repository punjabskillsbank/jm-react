import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SignupProvider } from './SignupContext';
import Step13 from './Step13_Bio';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom'; // Add this import

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep other exports intact
  useNavigate: jest.fn(),
}));

test('renders Step13 and updates bio as user types', async () => {
  // Create a mock navigate function
  const navigateMock = jest.fn();
  // Mock the return value of useNavigate
  (useNavigate as jest.Mock).mockReturnValue(navigateMock);

  render(
    <MemoryRouter>
      <SignupProvider>
        <Step13 />
      </SignupProvider>
    </MemoryRouter>
  );

  // Ensure the textarea and buttons are rendered
  const bioTextarea = screen.getByPlaceholderText(/enter your bio here/i);
  const nextButton = screen.getByRole('button', { name: /Next/i });
  const backButton = screen.getByRole('button', { name: /Back/i });

  // Test that the textarea is initially empty or populated with correct data
  expect(bioTextarea).toBeInTheDocument();
  expect(bioTextarea).toHaveValue('');

  // Simulate typing in the bio textarea
  fireEvent.change(bioTextarea, { target: { value: 'This is a test bio' } });

  // Test if the bio value updates correctly
  expect(bioTextarea).toHaveValue('This is a test bio');

  // Simulate clicking the Next button
  fireEvent.click(nextButton);

  // Test if updateSignupData is called with the updated bio
  await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/signup/step14'));

  // Simulate clicking the Back button
  fireEvent.click(backButton);

  // Test if the navigate function is called with the correct previous route
  await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/signup/step12'));
});