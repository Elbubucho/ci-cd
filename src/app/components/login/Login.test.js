import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import * as api from "../../api";

jest.mock("../../api");

describe("Login", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders email, password and login button", () => {
        render(<Login onLogin={() => {}} />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    it("calls onLogin(true) when the API returns admin", async () => {
        api.login.mockResolvedValueOnce(true);
        const onLogin = jest.fn();
        render(<Login onLogin={onLogin} />);

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "loise.fenoll@ynov.com" } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "PvdrTAzTeR247sDnAZBr" } });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => expect(onLogin).toHaveBeenCalledWith(true));
        expect(api.login).toHaveBeenCalledWith("loise.fenoll@ynov.com", "PvdrTAzTeR247sDnAZBr");
    });

    it("shows an error and does not call onLogin when credentials are wrong", async () => {
        api.login.mockResolvedValueOnce(false);
        const onLogin = jest.fn();
        render(<Login onLogin={onLogin} />);

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "wrong@example.com" } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "bad" } });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await screen.findByTestId("login-error");
        expect(onLogin).not.toHaveBeenCalled();
    });
});
