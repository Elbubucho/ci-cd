import axios from "axios";
import { countUsers, getUsers, createUser, deleteUser, login } from "./api";

jest.mock("axios");

const PORT = process.env.REACT_APP_SERVER_PORT;
const BASE = `http://localhost:${PORT}`;

describe("api module", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getUsers", () => {
        it("returns the users array on success", async () => {
            axios.get.mockResolvedValueOnce({ data: { users: [{ id: 1, first_name: "Jean" }] } });
            const result = await getUsers();
            expect(axios.get).toHaveBeenCalledWith(`${BASE}/users`);
            expect(result).toEqual([{ id: 1, first_name: "Jean" }]);
        });

        it("returns an empty array when users field is missing", async () => {
            axios.get.mockResolvedValueOnce({ data: {} });
            const result = await getUsers();
            expect(result).toEqual([]);
        });

        it("propagates an error on network failure", async () => {
            axios.get.mockImplementationOnce(() => Promise.reject(new Error("network")));
            await expect(getUsers()).rejects.toThrow("network");
        });
    });

    describe("countUsers", () => {
        it("returns the length of users on success", async () => {
            axios.get.mockResolvedValueOnce({ data: { users: [{ id: 1 }, { id: 2 }] } });
            expect(await countUsers()).toBe(2);
        });

        it("returns 0 when no users", async () => {
            axios.get.mockResolvedValueOnce({ data: { users: [] } });
            expect(await countUsers()).toBe(0);
        });

        it("propagates an error on failure", async () => {
            axios.get.mockImplementationOnce(() => Promise.reject(new Error("down")));
            await expect(countUsers()).rejects.toThrow("down");
        });
    });

    describe("createUser", () => {
        it("posts the payload and returns the response data", async () => {
            const payload = {
                first_name: "Jean",
                name: "Dupont",
                email: "jean@example.com",
                birth: "1998-01-22",
                postcode: "75001",
                city: "Paris",
            };
            axios.post.mockResolvedValueOnce({ data: { status: "ok", id: 42 } });
            const result = await createUser(payload);
            expect(axios.post).toHaveBeenCalledWith(`${BASE}/user`, payload);
            expect(result).toEqual({ status: "ok", id: 42 });
        });

        it("propagates an error when the backend rejects the user", async () => {
            axios.post.mockImplementationOnce(() => Promise.reject(new Error("duplicate")));
            await expect(createUser({})).rejects.toThrow("duplicate");
        });
    });

    describe("deleteUser", () => {
        it("calls DELETE on the correct URL and returns the response data", async () => {
            axios.delete.mockResolvedValueOnce({ data: { status: "deleted", id: 7 } });
            const result = await deleteUser(7);
            expect(axios.delete).toHaveBeenCalledWith(`${BASE}/users/7`);
            expect(result).toEqual({ status: "deleted", id: 7 });
        });

        it("propagates an error when the user does not exist", async () => {
            axios.delete.mockImplementationOnce(() => Promise.reject(new Error("not found")));
            await expect(deleteUser(999)).rejects.toThrow("not found");
        });
    });

    describe("login", () => {
        it("returns true when the backend says is_admin: true", async () => {
            axios.post.mockResolvedValueOnce({ data: { is_admin: true } });
            const result = await login("loise.fenoll@ynov.com", "PvdrTAzTeR247sDnAZBr");
            expect(axios.post).toHaveBeenCalledWith(`${BASE}/login`, {
                email: "loise.fenoll@ynov.com",
                password: "PvdrTAzTeR247sDnAZBr",
            });
            expect(result).toBe(true);
        });

        it("returns false when credentials are wrong (401)", async () => {
            axios.post.mockImplementationOnce(() => Promise.reject(new Error("unauthorized")));
            const result = await login("wrong@example.com", "bad");
            expect(result).toBe(false);
        });

        it("returns false when the response is not admin", async () => {
            axios.post.mockResolvedValueOnce({ data: { is_admin: false } });
            const result = await login("x@y.com", "z");
            expect(result).toBe(false);
        });
    });
});
