import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useSignup } from './SignupContext';
import Step14 from './Step14_Details';


jest.mock('./SignupContext', () => ({
  useSignup: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Step14 Component', () => {
  const mockNavigate = jest.fn();
  const mockUpdateSignupData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSignup as jest.Mock).mockReturnValue({
      signupData: {
        dob: '',
        country: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
      },
      updateSignupData: mockUpdateSignupData,
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders the component correctly', () => {
    render(
      <MemoryRouter>
        <Step14 />
      </MemoryRouter>
    );

    expect(screen.getByText('10/10 - Final Details')).toBeInTheDocument();
    expect(screen.getByText('Upload Photo')).toBeInTheDocument();
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('validates the form and shows errors when fields are empty', () => {
    render(
      <MemoryRouter>
        <Step14 />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Review Your Profile'));

    expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
    expect(screen.getByText('Country is required')).toBeInTheDocument();
    expect(screen.getByText('Street address is required')).toBeInTheDocument();
    expect(screen.getByText('City is required')).toBeInTheDocument();
    expect(screen.getByText('State/Province is required')).toBeInTheDocument();
    expect(screen.getByText('ZIP/Postal Code is required')).toBeInTheDocument();
    expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    expect(screen.getByText('Profile photo is required')).toBeInTheDocument();
  });
});
