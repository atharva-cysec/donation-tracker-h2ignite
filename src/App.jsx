import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import CausesPage from './pages/CausesPage';
import CauseDetailsPage from './pages/CauseDetailsPage';
import MyDonationsPage from './pages/MyDonationsPage';
import DonationDetailsPage from './pages/DonationDetailsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ── Protected routes (require auth) ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/causes"
            element={
              <ProtectedRoute>
                <CausesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/causes/:id"
            element={
              <ProtectedRoute>
                <CauseDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-donations"
            element={
              <ProtectedRoute>
                <MyDonationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-donations/:id"
            element={
              <ProtectedRoute>
                <DonationDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* ── Redirects & 404 ── */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
