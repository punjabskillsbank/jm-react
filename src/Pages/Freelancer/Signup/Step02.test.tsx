import { render, screen, fireEvent } from '@testing-library/react';
import Step2 from './Step02_Get_Started';

describe('Step2', () => {
  test('renders fields', () => {
    render(<Step2 />);
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zip Code/i)).toBeInTheDocument();
  });

  test('shows error on invalid zip code', async () => {
    render(<Step2 />);
    fireEvent.change(screen.getByLabelText(/Zip Code/i), {
      target: { value: 'abc' },
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(await screen.findByText(/invalid zip code/i)).toBeInTheDocument();
  });
});
