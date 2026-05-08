import { apiClient } from '../api/apiClient'

export const requestService = {
  getAllRequests: () => apiClient.get('/requests'),

  getMyRequests: () => apiClient.get('/requests/my'),

  createRequest: ({ description }) =>
    apiClient.post('/requests', { description }),

  // Your backend uses PUT /requests/{id}/status with body { "status": "APPROVED" }
  approveRequest: (requestId) =>
    apiClient.put(`/requests/${requestId}/status`, { status: 'APPROVED' }),

  rejectRequest: (requestId) =>
    apiClient.put(`/requests/${requestId}/status`, { status: 'REJECTED' }),

  getStats: () => apiClient.get('/requests/stats'),
}