# FlowDesk — Approval Workflow System

A modern, production-style approval workflow frontend built with **React + Vite + Tailwind CSS**.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ installed
- npm or yarn

### Installation

```bash
# 1. Navigate into the project
cd approval-workflow

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open your browser at **http://localhost:5173**

---

## 🔑 Demo Credentials

| Role     | Username   | Password   | Redirects to         |
|----------|------------|------------|----------------------|
| Employee | `employee` | `password` | Employee Dashboard   |
| Manager  | `manager`  | `password` | Manager Dashboard    |

> Click the **Employee Demo** or **Manager Demo** buttons on the login page for one-click credential fill.

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── layout/         # Sidebar, TopNavbar
│   └── ui/             # Avatar, EmptyState, RequestCard, Spinner, StatusBadge, StatsCard
├── context/
│   ├── AuthContext.jsx       # Auth state + login/logout
│   ├── RequestsContext.jsx   # Global requests state
│   └── ToastContext.jsx      # Toast notification system
├── data/
│   └── mockData.js           # Seed data: users, requests, categories
├── hooks/
│   ├── useAsync.js           # Async state manager hook
│   └── useLocalStorage.js    # localStorage sync hook
├── layouts/
│   └── DashboardLayout.jsx   # Sidebar + header layout wrapper
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── employee/
│   │   ├── EmployeeDashboard.jsx
│   │   ├── CreateRequestPage.jsx
│   │   └── MyRequestsPage.jsx
│   └── manager/
│       ├── ManagerDashboard.jsx
│       └── AllRequestsPage.jsx
├── routes/
│   └── ProtectedRoute.jsx    # Role-based route guard
├── services/
│   ├── authService.js        # Mock authentication API
│   └── requestService.js     # Mock requests CRUD API
└── utils/
    └── helpers.js            # Date formatting, status helpers, etc.
```

---

## ✨ Features

### Authentication
- Mock login with localStorage persistence
- Role-based routing (Employee vs Manager)
- Protected routes redirect unauthenticated users
- Persistent session across page refreshes

### Employee
- **Dashboard** — Stats overview (total/pending/approved/rejected) + recent requests
- **Create Request** — Form with category, description, character counter, validation
- **My Requests** — Full list with status filter tabs (All / Pending / Approved / Rejected)

### Manager
- **Dashboard** — System-wide stats + pending requests preview + approval rate bar
- **All Requests** — Complete list with approve/reject buttons + status filters

### UI/UX
- Toast notifications (success, error, warning, info)
- Loading states with spinner
- Empty states with context-aware messaging
- Colored status badges (Yellow=Pending, Green=Approved, Red=Rejected)
- Smooth transitions and hover effects
- Responsive sidebar layout
- Status filter tabs with counts

---

## 🛠️ Tech Stack

| Tool            | Purpose                        |
|-----------------|--------------------------------|
| React 18        | UI library                     |
| Vite 5          | Build tool + dev server        |
| Tailwind CSS 3  | Utility-first styling          |
| React Router 6  | Client-side routing            |
| Context API     | State management               |

---

## 🔌 Connecting a Real Backend

All API calls are isolated in `src/services/`:
- `authService.js` — Replace `login()` with a real POST to `/api/auth/login`
- `requestService.js` — Replace each method with real fetch/axios calls

The context files (`AuthContext`, `RequestsContext`) call these services, so swapping mock ↔ real requires changes only in the service layer.

---

## 📦 Build for Production

```bash
npm run build
# Output is in the /dist folder
```

---

## 🧑‍💻 Author

Built as a production-grade frontend demo.
