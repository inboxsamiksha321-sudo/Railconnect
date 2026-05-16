import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/layout/Layout'

// Auth Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Public Pages
import Landing from '../pages/public/Landing'
import TrackComplaint from '../pages/public/TrackComplaint'
import Notices from '../pages/public/Notices'

// Passenger Pages
import Dashboard from '../pages/passenger/Dashboard'
import FileComplaint from '../pages/passenger/FileComplaint'
import MyComplaints from '../pages/passenger/MyComplaints'
import ComplaintDetail from '../pages/passenger/ComplaintDetail'
import Notifications from '../pages/passenger/Notifications'
import Profile from '../pages/passenger/Profile'

const Placeholder = ({ name }) => (
  <div className="min-h-screen bg-rail-bg flex items-center justify-center">
    <div className="text-center">
      <p className="font-syne font-bold text-rail-blue text-3xl mb-2">{name}</p>
      <p className="text-rail-gray font-dm">Coming soon...</p>
    </div>
  </div>
)

const ProtectedRoute = () => {
  return <Outlet />
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/"        element={<Landing />}        />
          <Route path="/track"   element={<TrackComplaint />} />
          <Route path="/notices" element={<Notices />}        />
          <Route path="/about"   element={<Placeholder name="About RailConnect" />} />
          <Route path="/contact" element={<Placeholder name="Contact Us" />}        />
        </Route>

        {/* Auth Routes */}
        <Route path="/login"    element={<Login />}    />
        <Route path="/register" element={<Register />} />

        {/* Passenger Routes */}
        <Route element={<ProtectedRoute allowedRole="passenger" />}>
          <Route element={<Layout />}>
            <Route path="/passenger/dashboard"        element={<Dashboard />}       />
            <Route path="/passenger/complaints/new"   element={<FileComplaint />}   />
            <Route path="/passenger/complaints"       element={<MyComplaints />}    />
            <Route path="/passenger/complaints/:id"   element={<ComplaintDetail />} />
            <Route path="/passenger/notifications"    element={<Notifications />}   />
            <Route path="/passenger/profile"          element={<Profile />}         />
          </Route>
        </Route>

        

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes