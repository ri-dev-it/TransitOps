import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Fuel from './pages/Fuel';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import AccessDenied from './pages/AccessDenied';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthToast from './components/AuthToast';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <AuthToast />
      <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/unauthorized" element={<AccessDenied />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/vehicles" element={<ProtectedRoute allowedRoles={['fleet-manager', 'safety-officer']}><Layout><Vehicles /></Layout></ProtectedRoute>} />
      <Route path="/drivers" element={<ProtectedRoute allowedRoles={['fleet-manager']}><Layout><Drivers /></Layout></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute allowedRoles={['fleet-manager', 'driver']}><Layout><Trips /></Layout></ProtectedRoute>} />
      <Route path="/maintenance" element={<ProtectedRoute allowedRoles={['fleet-manager', 'safety-officer']}><Layout><Maintenance /></Layout></ProtectedRoute>} />
      <Route path="/fuel" element={<ProtectedRoute allowedRoles={['fleet-manager', 'financial-analyst']}><Layout><Fuel /></Layout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={['fleet-manager', 'safety-officer', 'financial-analyst']}><Layout><Reports /></Layout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
