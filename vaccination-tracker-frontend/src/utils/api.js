// // src/utils/api.js
// const BASE_URL = 'http://localhost:8082/api';

// export const login = async (username, password) => {
//   const res = await fetch(`${BASE_URL}/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: new URLSearchParams({ username, password }),
//     credentials: 'include',
//   });
//   return res.json();
// };

// export const logout = async () => {
//   const res = await fetch(`${BASE_URL}/auth/logout`, {
//     method: 'POST',
//     credentials: 'include',
//   });
//   return res.json();
// };

// export const checkSession = async () => {
//   const res = await fetch(`${BASE_URL}/auth/session`, {
//     method: 'GET',
//     credentials: 'include',
//   });
//   return res.json();
// };
// src/utils/api.js
export async function apiFetch(url, options = {}) {
    const fullUrl = `http://localhost:8082${url}`;
    const config = {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };
    const response = await fetch(fullUrl, config);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  }