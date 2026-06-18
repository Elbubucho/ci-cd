import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import * as api from "./api";

jest.mock("./api");

describe("App", () => {
    beforeEach(() => {
        api.countUsers.mockResolvedValue(0);
        api.getUsers.mockResolvedValue([]);
        api.login.mockResolvedValue(false);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders the header and zero users on first render", async () => {
        render(<App />);
        expect(screen.getByRole("heading", { name: /users manager/i })).toBeInTheDocument();
        await waitFor(() => expect(api.countUsers).toHaveBeenCalled());
        expect(screen.getByText(/0 user\(s\) already registered/i)).toBeInTheDocument();
    });

    it("renders the Login form when not admin", () => {
        render(<App />);
        expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });

    it("renders the RegisterForm with its first name field", () => {
        render(<App />);
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    });

    it("shows the user count returned by countUsers", async () => {
        api.countUsers.mockResolvedValueOnce(5);
        render(<App />);
        expect(await screen.findByText(/5 user\(s\) already registered/i)).toBeInTheDocument();
    });

    it("handles a countUsers error by falling back to 0", async () => {
        api.countUsers.mockRejectedValueOnce(new Error("down"));
        render(<App />);
        await waitFor(() => expect(api.countUsers).toHaveBeenCalled());
        expect(screen.getByText(/0 user\(s\) already registered/i)).toBeInTheDocument();
    });

    it("shows the admin badge after a successful login", async () => {
        api.login.mockResolvedValueOnce(true);
        render(<App />);
        const loginForm = screen.getByTestId("login-form");
        fireEvent.change(loginForm.querySelector("#login-email"), { target: { value: "admin@test.com" } });
        fireEvent.change(loginForm.querySelector("#login-password"), { target: { value: "any-password" } });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));
        expect(await screen.findByTestId("admin-badge")).toBeInTheDocument();
    });
});
