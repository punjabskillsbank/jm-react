import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Step4 from './Step04_Work_Preference';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Step4 - Work Preferences', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  const renderStep = () => render(<Step4 />, { wrapper: MemoryRouter });

  test('renders all checkbox options with descriptions', () => {
    renderStep();

    expect(screen.getByLabelText(/I'd like to find opportunities myself/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I'd like to package up my work for clients to buy/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I'm open to contract-to-hire opportunities/i)).toBeInTheDocument();

    expect(screen.getByText(/Clients post jobs on our Talent Marketplace/i)).toBeInTheDocument();
    expect(screen.getByText(/Define your service with prices and timelines/i)).toBeInTheDocument();
    expect(screen.getByText(/Start with a contract, and later explore/i)).toBeInTheDocument();
  });

  test('clicking checkboxes toggles selection', async () => {
    renderStep();

    const firstCheckbox = screen.getByLabelText(/I'd like to find opportunities myself/i);
    await userEvent.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();

    await userEvent.click(firstCheckbox);
    expect(firstCheckbox).not.toBeChecked();
  });

  test('clicking Next navigates to /signup/step5', async () => {
    renderStep();
    await userEvent.click(screen.getByText(/Next, Create a Profile/i));
    expect(mockNavigate).toHaveBeenCalledWith('/signup/step5');
  });

  test('clicking Back navigates to /signup/step3', async () => {
    renderStep();
    await userEvent.click(screen.getByText(/Back/i));
    expect(mockNavigate).toHaveBeenCalledWith('/signup/step3');
  });
});
