import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders the RegisterForm with all its fields', () => {
        render(<App />);
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    });
});
