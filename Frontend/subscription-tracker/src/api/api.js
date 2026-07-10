const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Thin wrapper around fetch that:
 *  - Prepends BASE_URL to the endpoint
 *  - Attaches the JWT token as a Bearer header when provided
 *  - Always sends/expects JSON
 *  - Throws an Error with the backend's message on non-2xx responses
 *
 * Usage:
 *   const data = await apiFetch("/api/subscriptions", {}, token);
 *   const data = await apiFetch("/api/auth/login", { method: "POST", body: { email, password } });
 */
export async function apiFetch(endpoint, { method = "GET", body } = {}, token = null) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Request failed: ${res.status}`);
    }

    // 204 No Content (e.g. DELETE) has no body to parse
    if (res.status === 204) return null;
    return res.json();
}
