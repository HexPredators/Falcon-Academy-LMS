import React, { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Assignments = lazy(() => import('./pages/Assignments'))
const Quizzes = lazy(() => import('./pages/Quizzes'))
const Library = lazy(() => import('./pages/Library'))
const Messages = lazy(() => import('./pages/Messages'))
const News = lazy(() => import('./pages/News'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Settings = lazy(() => import('./pages/Settings'))
const Profile = lazy(() => import('./pages/Profile'))

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

const routes = [
  {
    path: '/login',
    element: Login,
    protected: false,
  },
  {
    path: '/register',
    element: Register,
    protected: false,
  },
  {
    path: '/dashboard',
    element: () => (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: '/assignments',
    element: () => (
      <ProtectedRoute allowedRoles={['teacher', 'student', 'director', 'admin']}>
        <Assignments />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: '/quizzes',
    element: () => (
      <ProtectedRoute allowedRoles={['teacher', 'student', 'director', 'admin']}>
        <Quizzes />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: '/library',
    element: () => (
      <ProtectedRoute>
        <Library />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: '/messages',
    element: () => (
      <ProtectedRoute>
        <Messages />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: '/news',
    element: () => (
      <ProtectedRoute>
        <News />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: '/analytics',
    element: () => (
      <ProtectedRoute allowedRoles={['teacher', 'director', 'admin']}>
        <Analytics />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: '/settings',
    element: () => (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: '/profile',
    element: () => (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    protected: true,
  },
  {
    path: '/',
    element: () => <Navigate to="/dashboard" replace />,
    protected: false,
  },
]

export default routes