import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Step10 from './Step10_Education';
import { useSignup } from './SignupContext';

// Mock context and navigation
jest.mock('./SignupContext', () => ({
useSignup: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
...jest.requireActual('react-router-dom'),
useNavigate: jest.fn(),
}));

describe('Step10_Education Component', () => {
const mockNavigate = jest.fn();
const mockUpdateSignupData = jest.fn();

beforeEach(() => {
jest.clearAllMocks();
(useSignup as jest.Mock).mockReturnValue({
signupData: {},
updateSignupData: mockUpdateSignupData,
});
(useNavigate as jest.Mock).mockReturnValue(mockNavigate);
});

it('renders the component with all form fields', () => {
render(
<MemoryRouter>
<Step10 />
</MemoryRouter>
);


expect(screen.getByText('6/10')).toBeInTheDocument();
expect(screen.getByText('Add Your Education')).toBeInTheDocument();
expect(screen.getByText(/schools, colleges, or institutions/i)).toBeInTheDocument();

const instituteInput = screen.getByLabelText(/Institute/i);
const degreeInput = screen.getByLabelText(/Degree/i);
const startYearInput = screen.getByLabelText(/Start Year/i);
const endYearInput = screen.getByLabelText(/End Year/i);
const descriptionInput = screen.getByLabelText(/Description/i);

expect(instituteInput).toBeInTheDocument();
expect(degreeInput).toBeInTheDocument();
expect(startYearInput).toBeInTheDocument();
expect(endYearInput).toBeInTheDocument();
expect(descriptionInput).toBeInTheDocument();
});

it('updates fields when user types into inputs', () => {
render(
<MemoryRouter>
<Step10 />
</MemoryRouter>
);


fireEvent.change(screen.getByLabelText(/Institute/i), { target: { value: 'MIT' } });
fireEvent.change(screen.getByLabelText(/Degree/i), { target: { value: 'B.Tech' } });
fireEvent.change(screen.getByLabelText(/Start Year/i), { target: { value: '2018' } });
fireEvent.change(screen.getByLabelText(/End Year/i), { target: { value: '2022' } });
fireEvent.change(screen.getByLabelText(/Description/i), {
  target: { value: 'Studied Engineering' },
});

expect(screen.getByLabelText(/Institute/i)).toHaveValue('MIT');
expect(screen.getByLabelText(/Degree/i)).toHaveValue('B.Tech');
expect(screen.getByLabelText(/Start Year/i)).toHaveValue('2018');
expect(screen.getByLabelText(/End Year/i)).toHaveValue('2022');
expect(screen.getByLabelText(/Description/i)).toHaveValue('Studied Engineering');
});

it('adds another education entry when "+ Add Another Education" is clicked', () => {
render(
<MemoryRouter>
<Step10 />
</MemoryRouter>
);


fireEvent.click(screen.getByText(/\+ Add Another Education/i));
const allInstituteFields = screen.getAllByLabelText(/Institute/i);
expect(allInstituteFields.length).toBe(2);
});

it('removes an education entry when "Remove This Education" is clicked', () => {
render(
<MemoryRouter>
<Step10 />
</MemoryRouter>
);

fireEvent.click(screen.getByText(/\+ Add Another Education/i));
let allInstituteFields = screen.getAllByLabelText(/Institute/i);
expect(allInstituteFields.length).toBe(2);

fireEvent.click(screen.getAllByText(/Remove This Education/i)[0]);
allInstituteFields = screen.getAllByLabelText(/Institute/i);
expect(allInstituteFields.length).toBe(1);
});

it('navigates to the previous step when Back is clicked', () => {
render(
<MemoryRouter>
<Step10 />
</MemoryRouter>
);

fireEvent.click(screen.getByText(/Back/i));
expect(mockNavigate).toHaveBeenCalledWith('/signup/step9');
});

it('updates signup data and navigates to next step when Next is clicked', () => {
render(
<MemoryRouter>
<Step10 />
</MemoryRouter>
);


fireEvent.change(screen.getByLabelText(/Institute/i), { target: { value: 'ABC College' } });
fireEvent.change(screen.getByLabelText(/Degree/i), { target: { value: 'MBA' } });

fireEvent.click(screen.getByText(/Next, Add Your Skills/i));

expect(mockUpdateSignupData).toHaveBeenCalledWith({
  education: [
    {
      institute: 'ABC College',
      degree: 'MBA',
      start_year: '',
      end_year: '',
      description: '',
    },
  ],
});

expect(mockNavigate).toHaveBeenCalledWith('/signup/step11');
});
});