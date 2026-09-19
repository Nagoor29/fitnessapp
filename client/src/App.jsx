import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Workouts from './pages/Workouts';
import AiCoach from './pages/AiCoach';
import Exercises from './pages/Exercises';
import Profile from './pages/Profile';
import MotionShowcase from './pages/MotionShowcase';
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { useFitness } from './context/FitnessContext';

function App() {
  const { isAuthenticated, loading } = useAuth();
  const { hasProfile, loadingProfile } = useFitness();
  const location = useLocation();

  // If user is authenticated, has no profile, and is not currently on /onboarding, redirect to /onboarding
  const shouldOnboard = isAuthenticated && hasProfile === false && location.pathname !== '/onboarding';

  const isFullBleedPage = location.pathname === '/' || location.pathname === '/3d-preview';

  return (
    <div className="app-container">
      <Navbar />
      <main className={`main-content ${isFullBleedPage ? 'main-content-full' : ''}`}>
        {shouldOnboard ? (
          <Navigate to="/onboarding" replace />
        ) : (
          <Routes>
            {/* Public Authentication Routes */}
            <Route
              path="/login"
              element={
                !loading && isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/register"
              element={
                !loading && isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Register />
                )
              }
            />

            {/* Public 3D Motion Preview Showcase */}
            <Route path="/3d-preview" element={<MotionShowcase />} />

            {/* Protected Onboarding Route */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            {/* Protected Core App Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <Workouts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-coach"
              element={
                <ProtectedRoute>
                  <AiCoach />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exercises"
              element={
                <ProtectedRoute>
                  <Exercises />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Root Landing Route */}
            <Route
              path="/"
              element={
                !loading && isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Home />
                )
              }
            />
            <Route path="/home" element={<Home />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;
