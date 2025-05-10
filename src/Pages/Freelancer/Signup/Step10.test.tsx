import { render, screen, fireEvent, within } from '@testing-library/react';
import Step10 from './Step10_Education';
import { SignupProvider } from './SignupContext';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <MemoryRouter>
      <SignupProvider>{ui}</SignupProvider>
    </MemoryRouter>
  );

test('renders Step10 and displays the form fields', () => {
  renderWithProviders(<Step10 />);

  const instituteInput = within(screen.getByText(/Institute/i).closest('div')!).getByRole('textbox');
  const degreeInput = within(screen.getByText(/Degree/i).closest('div')!).getByRole('textbox');
  const startYearInput = within(screen.getByText(/Start Year/i).closest('div')!).getByRole('textbox');
  const endYearInput = within(screen.getByText(/End Year/i).closest('div')!).getByRole('textbox');
  const descriptionInput = within(screen.getByText(/Description/i).closest('div')!).getByRole('textbox');

  expect(instituteInput).toBeInTheDocument();
  expect(degreeInput).toBeInTheDocument();
  expect(startYearInput).toBeInTheDocument();
  expect(endYearInput).toBeInTheDocument();
  expect(descriptionInput).toBeInTheDocument();
});

test('update form fields correctly when user types', () => {
  renderWithProviders(<Step10 />);

  const instituteInput = within(screen.getByText(/Institute/i).closest('div')!).getByRole('textbox');
  const degreeInput = within(screen.getByText(/Degree/i).closest('div')!).getByRole('textbox');
  const startYearInput = within(screen.getByText(/Start Year/i).closest('div')!).getByRole('textbox');
  const endYearInput = within(screen.getByText(/End Year/i).closest('div')!).getByRole('textbox');
  const descriptionInput = within(screen.getByText(/Description/i).closest('div')!).getByRole('textbox');

  fireEvent.change(instituteInput, { target: { value: 'Some Institute' } });
  fireEvent.change(degreeInput, { target: { value: 'Bachelors' } });
  fireEvent.change(startYearInput, { target: { value: '2020' } });
  fireEvent.change(endYearInput, { target: { value: '2024' } });
  fireEvent.change(descriptionInput, { target: { value: 'Studied Computer Science.' } });

  expect((instituteInput as HTMLInputElement).value).toBe('Some Institute');
  expect((degreeInput as HTMLInputElement).value).toBe('Bachelors');
  expect((startYearInput as HTMLInputElement).value).toBe('2020');
  expect((endYearInput as HTMLInputElement).value).toBe('2024');
  expect((descriptionInput as HTMLInputElement).value).toBe('Studied Computer Science.');
});

test('navigate to next step when Next button is clicked', () => {
  renderWithProviders(<Step10 />);
  
  const nextButton = screen.getByText(/Next, Add Your Skills/i);
  fireEvent.click(nextButton);

  // Optional: Add a mock for navigation check if needed
});
