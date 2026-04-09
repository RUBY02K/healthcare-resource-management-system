import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import HospitalDashboard from './pages/HospitalDashboard'
import DonorDashboard from './pages/DonorDashboard'
import BloodInventory from './pages/BloodInventory'
import BloodRequests from './pages/BloodRequests'
import OrganDonation from './pages/OrganDonation'
import DonorsList from './pages/DonorsList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/blood-inventory" element={<BloodInventory />} />
        <Route path="/blood-requests" element={<BloodRequests />} />
        <Route path="/organ-donation" element={<OrganDonation />} />
        <Route path="/donors-list" element={<DonorsList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App