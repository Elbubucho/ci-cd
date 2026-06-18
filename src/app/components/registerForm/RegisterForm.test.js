import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import RegisterForm from "./RegisterForm";
import * as api from "../../api";

jest.mock("../../api");

const labels = {
    firstname: /first name/i,
    name: /^name$/i,
    email: /email/i,
    birth: /birth/i,
    postcode: /postcode/i,
    city: /city/i,
};

const validValues = {
    firstname: "Jean",
    name: "Dupont",
    email: "jean@example.com",
    birth: "1998-01-22",
    postcode: "75001",
    city: "Paris",
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

describe("RegisterForm integration tests", () => {
    beforeEach(() => {
        api.createUser.mockResolvedValue({ status: "ok", id: 1 });
        api.getUsers.mockResolvedValue([]);
        api.deleteUser.mockResolvedValue({ status: "deleted" });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders all fields and the submit button", () => {
        render(<RegisterForm />);
        Object.keys(labels).forEach((k) => {
            expect(getInput(k)).toBeInTheDocument();
        });
        expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
    });

    it("submit button is disabled when fields are empty", () => {
        render(<RegisterForm />);
        expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
    });

    it("shows an error for an invalid firstname", () => {
        render(<RegisterForm />);
        fillField("firstname", "Jean123");
        expect(screen.getByText(/invalid firstname/i)).toBeInTheDocument();
    });

    it("shows an error for an invalid name", () => {
        render(<RegisterForm />);
        fillField("name", "Dup@nt");
        expect(screen.getByText(/invalid name/i)).toBeInTheDocument();
    });

    it("shows an error for an invalid email", () => {
        render(<RegisterForm />);
        fillField("email", "not-an-email");
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });

    it("shows an error for an invalid postcode", () => {
        render(<RegisterForm />);
        fillField("postcode", "12");
        expect(screen.getByText(/invalid postcode/i)).toBeInTheDocument();
    });

    it("shows an error for an invalid city", () => {
        render(<RegisterForm />);
        fillField("city", "Paris99");
        expect(screen.getByText(/invalid city/i)).toBeInTheDocument();
    });

    it("shows an error when user is under 18", () => {
        render(<RegisterForm />);
        const recent = new Date();
        recent.setFullYear(recent.getFullYear() - 10);
        fillField("birth", recent.toISOString().split("T")[0]);
        expect(screen.getByText(/too young/i)).toBeInTheDocument();
    });

    it("enables submit button when all fields are valid", () => {
        render(<RegisterForm />);
        fillAllValid();
        expect(screen.getByRole("button", { name: /send/i })).toBeEnabled();
    });

    it("calls createUser with the form payload on submit", async () => {
        render(<RegisterForm />);
        fillAllValid();
        fireEvent.click(screen.getByRole("button", { name: /send/i }));
        await screen.findByTestId("toast");
        await waitFor(() => expect(getInput("firstname")).toHaveValue(""));
        expect(api.createUser).toHaveBeenCalledTimes(1);
        expect(api.createUser).toHaveBeenCalledWith({
            first_name: "Jean",
            name: "Dupont",
            email: "jean@example.com",
            birth: "1998-01-22",
            postcode: "75001",
            city: "Paris",
        });
    });

    it("shows the success toaster on successful submit", async () => {
        render(<RegisterForm />);
        fillAllValid();
        fireEvent.click(screen.getByRole("button", { name: /send/i }));
        const toast = await screen.findByTestId("toast");
        expect(toast).toHaveTextContent(/saved successfully/i);
        await waitFor(() => expect(getInput("firstname")).toHaveValue(""));
    });

    it("shows an error toaster when createUser fails", async () => {
        api.createUser.mockRejectedValueOnce(new Error("boom"));
        render(<RegisterForm />);
        fillAllValid();
        fireEvent.click(screen.getByRole("button", { name: /send/i }));
        const toast = await screen.findByTestId("toast");
        expect(toast).toHaveTextContent(/error saving user/i);
    });

    it("clears all fields after a successful submit", async () => {
        render(<RegisterForm />);
        fillAllValid();
        fireEvent.click(screen.getByRole("button", { name: /send/i }));
        await waitFor(() => expect(api.createUser).toHaveBeenCalled());
        await waitFor(() => {
            Object.keys(labels).forEach((k) => {
                expect(getInput(k)).toHaveValue("");
            });
        });
    });

    it("shows 'No registered users' when getUsers returns an empty list", async () => {
        render(<RegisterForm />);
        fireEvent.click(screen.getByRole("button", { name: /show registered users/i }));
        expect(await screen.findByTestId("users-list")).toBeInTheDocument();
        expect(screen.getByText(/no registered users/i)).toBeInTheDocument();
    });

    it("non-admin sees only first name from the API list", async () => {
        api.getUsers.mockResolvedValueOnce([
            { id: 1, first_name: "Jean", name: "Dupont", email: "jean@example.com", birth: "1998-01-22", postcode: "75001", city: "Paris" },
        ]);
        render(<RegisterForm />);
        fireEvent.click(screen.getByRole("button", { name: /show registered users/i }));
        expect(await screen.findByText(/Jean/)).toBeInTheDocument();
        expect(screen.queryByText(/jean@example\.com/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Paris/)).not.toBeInTheDocument();
    });

    it("admin sees private info and a delete button per user", async () => {
        api.getUsers.mockResolvedValueOnce([
            { id: 1, first_name: "Jean", name: "Dupont", email: "jean@example.com", birth: "1998-01-22", postcode: "75001", city: "Paris" },
        ]);
        render(<RegisterForm isAdmin={true} />);
        fireEvent.click(screen.getByRole("button", { name: /show registered users/i }));
        expect(await screen.findByText(/Dupont/)).toBeInTheDocument();
        expect(screen.getByText(/jean@example\.com/)).toBeInTheDocument();
        expect(screen.getByTestId("delete-1")).toBeInTheDocument();
    });

    it("admin clicking delete calls deleteUser with the right id", async () => {
        api.getUsers.mockResolvedValueOnce([
            { id: 1, first_name: "Jean", name: "Dupont", email: "jean@example.com", birth: "1998-01-22", postcode: "75001", city: "Paris" },
        ]);
        render(<RegisterForm isAdmin={true} />);
        fireEvent.click(screen.getByRole("button", { name: /show registered users/i }));
        const deleteBtn = await screen.findByTestId("delete-1");
        fireEvent.click(deleteBtn);
        await waitFor(() => expect(api.deleteUser).toHaveBeenCalledWith(1));
    });

    it("toggles the users list off when clicking show again", async () => {
        render(<RegisterForm />);
        const showBtn = screen.getByRole("button", { name: /show registered users/i });
        fireEvent.click(showBtn);
        expect(await screen.findByTestId("users-list")).toBeInTheDocument();
        fireEvent.click(showBtn);
        expect(screen.queryByTestId("users-list")).not.toBeInTheDocument();
    });

    it("shows an error toaster when deleteUser fails", async () => {
        api.getUsers.mockResolvedValueOnce([
            { id: 1, first_name: "Jean", name: "Dupont", email: "jean@example.com", birth: "1998-01-22", postcode: "75001", city: "Paris" },
        ]);
        api.deleteUser.mockRejectedValueOnce(new Error("nope"));
        render(<RegisterForm isAdmin={true} />);
        fireEvent.click(screen.getByRole("button", { name: /show registered users/i }));
        const deleteBtn = await screen.findByTestId("delete-1");
        fireEvent.click(deleteBtn);
        const toast = await screen.findByTestId("toast");
        expect(toast).toHaveTextContent(/error deleting user/i);
    });

    it("falls back to an empty list when getUsers throws", async () => {
        api.getUsers.mockRejectedValueOnce(new Error("down"));
        render(<RegisterForm />);
        fireEvent.click(screen.getByRole("button", { name: /show registered users/i }));
        expect(await screen.findByText(/no registered users/i)).toBeInTheDocument();
    });

    it("hides the success toaster after 3 seconds", async () => {
        jest.useFakeTimers({ advanceTimers: true });
        render(<RegisterForm />);
        fillAllValid();
        fireEvent.click(screen.getByRole("button", { name: /send/i }));
        await screen.findByTestId("toast");
        await act(async () => { jest.advanceTimersByTime(3000); });
        expect(screen.queryByTestId("toast")).not.toBeInTheDocument();
        jest.useRealTimers();
    });

    it("hides the error toaster after 3 seconds when submit fails", async () => {
        jest.useFakeTimers({ advanceTimers: true });
        api.createUser.mockRejectedValueOnce(new Error("boom"));
        render(<RegisterForm />);
        fillAllValid();
        fireEvent.click(screen.getByRole("button", { name: /send/i }));
        await screen.findByTestId("toast");
        await act(async () => { jest.advanceTimersByTime(3000); });
        expect(screen.queryByTestId("toast")).not.toBeInTheDocument();
        jest.useRealTimers();
    });

    it("hides the error toaster after 3 seconds when delete fails", async () => {
        jest.useFakeTimers({ advanceTimers: true });
        api.getUsers.mockResolvedValueOnce([
            { id: 1, first_name: "Jean", name: "Dupont", email: "jean@example.com", birth: "1998-01-22", postcode: "75001", city: "Paris" },
        ]);
        api.deleteUser.mockRejectedValueOnce(new Error("nope"));
        render(<RegisterForm isAdmin={true} />);
        fireEvent.click(screen.getByRole("button", { name: /show registered users/i }));
        fireEvent.click(await screen.findByTestId("delete-1"));
        await screen.findByTestId("toast");
        await act(async () => { jest.advanceTimersByTime(3000); });
        expect(screen.queryByTestId("toast")).not.toBeInTheDocument();
        jest.useRealTimers();
    });
});
