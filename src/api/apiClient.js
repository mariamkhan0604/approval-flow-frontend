const BASE_URL = 'http://localhost:8080'

// Encode credentials for Basic Auth
const makeBasicAuth = (username, password) =>
  'Basic ' + btoa(`${username}:${password}`)

// Read stored credentials
const getAuthHeader = () => {
  const creds = sessionStorage.getItem('credentials')
  return creds ? { Authorization: creds } : {}
}

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const apiClient = {
  // Login doesn't need auth header — just validates and stores credentials
  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await handleResponse(res)
    // Store encoded credentials for all future requests
    sessionStorage.setItem('credentials', makeBasicAuth(username, password))
    return data
  },

  get: (path) =>
    fetch(`${BASE_URL}${path}`, {
      headers: { ...getAuthHeader() },
    }).then(handleResponse),

  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(body),
    }).then(handleResponse),

  logout: () => sessionStorage.removeItem('credentials'),
}