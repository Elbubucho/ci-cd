import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders the RegisterForm with its first name field', () => {
        render(<App />);
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    });

    it('renders the Login form when not admin', () => {
        render(<App />);
        expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
});
