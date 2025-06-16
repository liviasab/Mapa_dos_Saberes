import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/Auth/LoginScreen';
import { SponsorshipScreen } from './components/Loading/SponsorshipScreen';
import { SpacesList } from './components/Spaces/SpacesList';
import { RegistrationCarousel } from './components/Registration/RegistrationCarousel';
import { SpaceDetailsView } from './components/SpaceDetails/SpaceDetailsView';
import { EditSpacePage } from './components/Spaces/EditSpacePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/loading\" replace /> : <LoginScreen />} />
      <Route path="/loading" element={
        <ProtectedRoute>
          <SponsorshipScreen />
        </ProtectedRoute>
      } />
      <Route path="/spaces" element={
        <ProtectedRoute>
          <SpacesList />
        </ProtectedRoute>
      } />
      <Route path="/spaces/:id" element={
        <ProtectedRoute>
          <SpaceDetailsView />
        </ProtectedRoute>
      } />
      <Route path="/spaces/:id/edit" element={
        <ProtectedRoute>
          <EditSpacePage />
        </ProtectedRoute>
      } />
      <Route path="/register" element={
        <ProtectedRoute>
          <RegistrationCarousel />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to={user ? "/loading" : "/login"} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;