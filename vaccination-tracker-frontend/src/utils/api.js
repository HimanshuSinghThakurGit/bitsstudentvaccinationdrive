
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