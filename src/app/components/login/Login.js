import { useState } from "react";
import { login as apiLogin } from "../../api";

/**
 * Page de login admin.
 *
 * Envoie `{email, password}` à `POST /login`. Sur succès,
 * appelle `onLogin(true)` pour signaler à l'app que l'utilisateur
 * est admin.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onLogin Callback appelé avec `true` quand le login admin réussit.
 * @returns {JSX.Element}
 */
export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const isAdmin = await apiLogin(email, password);
        if (isAdmin) {
            onLogin(true);
        } else {
            setError("Invalid credentials");
        }
    }

    return (
        <form onSubmit={handleSubmit} data-testid="login-form">
            <label htmlFor="login-email">Email </label>
            <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="login-password"> Password </label>
            <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            {error && <span data-testid="login-error" style={{ color: "red" }}>{error}</span>}
        </form>
    );
}
