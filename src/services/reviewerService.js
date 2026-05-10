import { apiClient } from '../api/apiClient'

export const reviewerService = {
  getPendingReviews: () => apiClient.get('/reviews/pending'),
  getAllGroupPending: () => apiClient.get('/reviews/all'),
  submitDecision: (requestId, decision) =>
    apiClient.post(`/reviews/${requestId}/decision`, { decision }),
  getAllRequests: () => apiClient.get('/reviews/history'),
}