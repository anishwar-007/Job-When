import React from 'react';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EmailTrackerProvider } from './context/EmailTrackerContext';
import AppHeader from './components/AppHeader';
import Login from './components/Login';
import TrackerPage from './pages/TrackerPage';
import JobsPage from './pages/JobsPage';

function AuthenticatedApp() {
  return (
    <EmailTrackerProvider>
      <BrowserRouter>
        <Box
          minH="100vh"
          bg="linear-gradient(160deg, #f0fdfa 0%, #e0f2fe 30%, #f8fafc 60%, #f0fdf4 100%)"
          _dark={{ bg: 'linear-gradient(160deg, #0f172a 0%, #134e4a 40%, #0c4a6e 70%, #14532d 100%)' }}
        >
          <AppHeader />
          <Routes>
            <Route path="/" element={<TrackerPage />} />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/jobs" element={<JobsPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </EmailTrackerProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center
        minH="100vh"
        bg="linear-gradient(160deg, #f0fdfa 0%, #e0f2fe 50%, #f8fafc 100%)"
        _dark={{ bg: 'linear-gradient(160deg, #0f172a 0%, #134e4a 50%, #0c4a6e 100%)' }}
      >
        <Spinner size="xl" colorScheme="teal" />
      </Center>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <AuthenticatedApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
