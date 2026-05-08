import { apiClient } from '../api/apiClient'

export const authService = {
  login: async (username, password) => {
    const data = await apiClient.login(username, password)
    // data shape: { userId, name, username, role, success }
    return {
      user: {
        id: data.userId,
        name: data.name,
        username: data.username,
        role: data.role,       // "EMPLOYEE" or "MANAGER"
      }
    }
  },

  logout: async () => {
    apiClient.logout()
    return { success: true }
  },
}