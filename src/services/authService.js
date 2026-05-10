import { apiClient } from '../api/apiClient'

export const authService = {
  login: async (username, password) => {
    const data = await apiClient.login(username, password)
    // data shape: { userId, name, username, role, success }

    // apiClient.login already stored the Basic Auth creds in sessionStorage
    // We return the user object — no separate token needed
    return {
      user: {
        id: data.userId,
        name: data.name,
        username: data.username,
        role: data.role,   // "EMPLOYEE", "MANAGER", or "REVIEWER"
      },
      token: 'basic-auth',   // ← dummy value so AuthContext doesn't clear storage
    }
  },

  logout: async () => {
    apiClient.logout()       // clears sessionStorage credentials
    return { success: true }
  },
}