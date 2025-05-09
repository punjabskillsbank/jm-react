// Step07.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Step7 from './Step07_Title'; // Adjust import path if necessary
import { SignupProvider } from './SignupContext'; // Adjust import path if necessary
import { MemoryRouter } from 'react-router-dom';

describe('Step7 Component', () => {
  it('renders the component correctly', () => {
    render(
      <MemoryRouter>
        <SignupProvider>
          <Step7 />
        </SignupProvider>
      </MemoryRouter>
    );
    // Add your assertions here
  });

  it('updates the input value when changed', () => {
    render(
      <MemoryRouter>
        <SignupProvider>
          <Step7 />
        </SignupProvider>
      </MemoryRouter>
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New title' } });
    expect((input as HTMLInputElement).value).toBe('New title');
  });
});
