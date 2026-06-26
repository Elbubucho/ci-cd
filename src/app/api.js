import axios from "axios";

function resolveApiUrl() {
    if (typeof window === "undefined") {
        return `http://localhost:${process.env.REACT_APP_SERVER_PORT || 8000}`;
    }
    const { hostname } = window.location;
    if (hostname.endsWith("github.io")) {
        return "https://ci-cd-integration-psi.vercel.app";
    }
    if (hostname === "localhost") {
        return `http://localhost:${process.env.REACT_APP_SERVER_PORT || 8000}`;
    }
    return `http://${hostname}:8000`;
}

const API_URL = resolveApiUrl();

/**
 * @file Wrappers axios autour des endpoints du backend FastAPI.
 * @module api
 */

/**
 * Récupère la liste complète des utilisateurs.
 * @returns {Promise<Array<Object>>} Liste des utilisateurs.
 */
export async function getUsers() {
    const response = await axios.get(`${API_URL}/users`);
    return response.data.users || [];
}

/**
 * Retourne le nombre d'utilisateurs enregistrés.
 * @returns {Promise<number>}
 */
export async function countUsers() {
    const users = await getUsers();
    return users.length;
}

/**
 * Crée un utilisateur.
 * @param {Object} payload Champs du user (first_name, name, email, birth, postcode, city).
 * @returns {Promise<Object>} Réponse `{ status, id }`.
 */
export async function createUser(payload) {
    const response = await axios.post(`${API_URL}/user`, payload);
    return response.data;
}

/**
 * Supprime un utilisateur par son id.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function deleteUser(id) {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
}

/**
 * Tente un login admin.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<boolean>} `true` si admin, `false` sinon.
 */
export async function login(email, password) {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data && response.data.is_admin === true;
    } catch {
        return false;
    }
}
