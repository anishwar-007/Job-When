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
        <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
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
      <Center minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
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
