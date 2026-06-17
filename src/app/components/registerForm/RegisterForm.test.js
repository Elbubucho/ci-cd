import { render, screen, fireEvent } from '@testing-library/react';
import RegisterForm from './RegisterForm';

const labels = {
    firstname: /first name/i,
    name: /^name$/i,
    email: /email/i,
    birth: /birth/i,
    postcode: /postcode/i,
    city: /city/i,
};

const validValues = {
    firstname: 'Jean',
    name: 'Dupont',
    email: 'jean@example.com',
    birth: '1998-01-22',
    postcode: '75001',
    city: 'Paris',
};

function getInput(key) {
    return screen.getByLabelText(labels[key]);
}

function fillField(key, value) {
    fireEvent.change(getInput(key), { target: { value } });
}

function fillAllValid() {
    Object.keys(labels).forEach((k) => fillField(k, validValues[k]));
}

describe('RegisterForm integration tests', () => {
    it('renders all fields and the submit button', () => {
        render(<RegisterForm />);
        Object.keys(labels).forEach((k) => {
            expect(getInput(k)).toBeInTheDocument();
        });
        expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('associates each label with its input via id/htmlFor', () => {
        render(<RegisterForm />);
        Object.keys(labels).forEach((k) => {
            expect(getInput(k)).toHaveAttribute('id', k);
        });
    });

    it('submit button is disabled when fields are empty', () => {
        render(<RegisterForm />);
        expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
    });

    it('submit button is disabled when only some fields are filled', () => {
        render(<RegisterForm />);
        fillField('firstname', 'Jean');
        fillField('name', 'Dupont');
        expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
    });

    it('shows an error for an invalid firstname', () => {
        render(<RegisterForm />);
        fillField('firstname', 'Jean123');
        const err = screen.getByText(/invalid firstname/i);
        expect(err).toBeInTheDocument();
        expect(err).toHaveStyle({ color: 'red' });
    });

    it('shows an error for an invalid name', () => {
        render(<RegisterForm />);
        fillField('name', 'Dup@nt');
        expect(screen.getByText(/invalid name/i)).toBeInTheDocument();
    });

    it('shows an error for an invalid email', () => {
        render(<RegisterForm />);
        fillField('email', 'not-an-email');
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });

    it('shows an error for an invalid postcode', () => {
        render(<RegisterForm />);
        fillField('postcode', '12');
        expect(screen.getByText(/invalid postcode/i)).toBeInTheDocument();
    });

    it('shows an error for an invalid city', () => {
        render(<RegisterForm />);
        fillField('city', 'Paris99');
        expect(screen.getByText(/invalid city/i)).toBeInTheDocument();
    });

    it('shows an error when user is under 18', () => {
        render(<RegisterForm />);
        const recent = new Date();
        recent.setFullYear(recent.getFullYear() - 10);
        fillField('birth', recent.toISOString().split('T')[0]);
        expect(screen.getByText(/too young/i)).toBeInTheDocument();
    });

    it('does not show errors when all fields are valid', () => {
        render(<RegisterForm />);
        fillAllValid();
        expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/too young/i)).not.toBeInTheDocument();
    });

    it('enables submit button when all fields are valid', () => {
        render(<RegisterForm />);
        fillAllValid();
        expect(screen.getByRole('button', { name: /send/i })).toBeEnabled();
    });

    it('does not show the users list before clicking the show button', () => {
        render(<RegisterForm />);
        expect(screen.queryByTestId('users-list')).not.toBeInTheDocument();
    });
});
