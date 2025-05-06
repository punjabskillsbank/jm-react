import { render, screen, fireEvent } from '@testing-library/react';
import Step10_Education from './Step10_Education';

describe('Step10_Education Component', () => {
    it('renders the component correctly', () => {
        render(<Step10_Education />);
        expect(screen.getByText(/Education Details/i)).toBeInTheDocument();
    });

    it('allows the user to add an education entry', () => {
        render(<Step10_Education />);
        const addButton = screen.getByText(/Add Education/i);
        fireEvent.click(addButton);
        expect(screen.getByText(/School Name/i)).toBeInTheDocument();
    });

    it('validates required fields before submission', () => {
        render(<Step10_Education />);
        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);
        expect(screen.getByText(/Please fill out all required fields/i)).toBeInTheDocument();
    });

    it('removes an education entry when delete is clicked', () => {
        render(<Step10_Education />);
        const addButton = screen.getByText(/Add Education/i);
        fireEvent.click(addButton);
        const deleteButton = screen.getByText(/Delete/i);
        fireEvent.click(deleteButton);
        expect(screen.queryByText(/School Name/i)).not.toBeInTheDocument();
    });

    it('handles input changes correctly', () => {
        render(<Step10_Education />);
        const addButton = screen.getByText(/Add Education/i);
        fireEvent.click(addButton);
        const schoolInput = screen.getByPlaceholderText(/Enter school name/i);
        fireEvent.change(schoolInput, { target: { value: 'Test University' } });
        expect(schoolInput).toHaveValue('Test University');
    });
});