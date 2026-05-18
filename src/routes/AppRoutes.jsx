import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/layout/layout'
import Login from '../pages/auth/Login'
import Landing from '../pages/Landing'
import Dashboard from '../pages/dept/Dashboard'
import Complaints from '../pages/dept/Complaints'
import ComplaintDetail from '../pages/dept/ComplaintDetail'
import Profile from '../pages/dept/Profile'
import ManageStaff from '../pages/dept/ManageStaff'

const Placeholder = ({ name }) => (
  <div className="min-h-screen bg-dept-bg flex items-center justify-center">
    <div className="text-center">
      <p className="font-syne font-bold text-dept-blue text-3xl mb-2">{name}</p>
      <p className="text-dept-gray font-dm">Coming soon...</p>
    </div>
  </div>
)

const ProtectedRoute = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/"       element={<Landing />} />
        <Route path="/login"  element={<Login />}   />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dept/dashboard" element={<Dashboard />} />
            <Route path="/dept/complaints" element={<Complaints />} />
            <Route path="/dept/complaints/:id" element={<ComplaintDetail />} />
            <Route path="/dept/staff" element={<ManageStaff />} />
            <Route path="/dept/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes