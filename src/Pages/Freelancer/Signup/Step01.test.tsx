import { render, screen, fireEvent } from '@testing-library/react';
import Step1 from './Step01_Client-Freelancer';

describe('Step1', () => {
  test('renders required fields', () => {
    render(<Step1 />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('validates empty form submission', async () => {
    render(<Step1 />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(await screen.findAllByText(/required/i)).toHaveLength(3);
  });
});
