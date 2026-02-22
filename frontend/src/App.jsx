import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';
import AdminAuth from './components/Admin/LoginAuth.admin';
import UserLogin from './components/user/Login.user';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/admin-auth" element={<AdminAuth />} />
        <Route path="/user-auth" element={<UserLogin />} />
        <Route path="/" element={<LandingPage />} />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected User Routes */}
        <Route 
          path="/user-dashboard" 
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;