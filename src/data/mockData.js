
export const MOCK_USERS = [
  {
    id: 'user-001',
    username: 'employee',
    password: 'password',
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    role: 'EMPLOYEE',
    avatar: 'AJ',
    department: 'Engineering',
    joinDate: '2023-06-15',
  },
  {
    id: 'user-002',
    username: 'manager',
    password: 'password',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@company.com',
    role: 'MANAGER',
    avatar: 'SM',
    department: 'Management',
    joinDate: '2021-03-01',
  },
]


export const MOCK_REQUESTS = [
  {
    id: 'REQ-001',
    employeeId: 'user-001',
    employeeName: 'Alex Johnson',
    department: 'Engineering',
    description: 'Request for attending the React Summit conference in Amsterdam. The conference covers advanced React patterns, performance optimization, and the latest ecosystem updates. Estimated cost: $1,200 including travel and accommodation.',
    status: 'PENDING',
    createdAt: '2025-05-01T09:30:00Z',
    updatedAt: '2025-05-01T09:30:00Z',
    category: 'Training & Development',
  },
  {
    id: 'REQ-002',
    employeeId: 'user-001',
    employeeName: 'Alex Johnson',
    department: 'Engineering',
    description: 'Approval needed for new MacBook Pro M4 (16-inch) to replace the current 4-year-old machine that is struggling with compilation times. This will improve developer productivity significantly.',
    status: 'APPROVED',
    createdAt: '2025-04-22T14:15:00Z',
    updatedAt: '2025-04-24T10:00:00Z',
    category: 'Equipment',
  },
  {
    id: 'REQ-003',
    employeeId: 'user-001',
    employeeName: 'Alex Johnson',
    department: 'Engineering',
    description: 'Request for a 2-week work-from-home arrangement from May 20 to May 31, due to a family situation that requires my presence at home during that period.',
    status: 'REJECTED',
    createdAt: '2025-04-18T11:00:00Z',
    updatedAt: '2025-04-20T09:00:00Z',
    category: 'Remote Work',
  },
  {
    id: 'REQ-004',
    employeeId: 'user-001',
    employeeName: 'Alex Johnson',
    department: 'Engineering',
    description: 'Budget approval for AWS credits worth $500/month to run staging environments for the new microservices architecture project. This will reduce dependency on the shared dev environment.',
    status: 'PENDING',
    createdAt: '2025-05-05T08:45:00Z',
    updatedAt: '2025-05-05T08:45:00Z',
    category: 'Infrastructure',
  },
]

/**
 * Request categories for dropdown selection
 */
export const REQUEST_CATEGORIES = [
  'Equipment',
  'Training & Development',
  'Remote Work',
  'Budget Approval',
  'Infrastructure',
  'Time Off',
  'Other',
]

/**
 * Status options
 */
export const STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}
