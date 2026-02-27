import React from 'react';
import { Box, Button, Container, HStack, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppIcon from './AppIcon';
import ResumeManager from './ResumeManager';

export default function AppHeader() {
  const location = useLocation();
  const { logout } = useAuth();
  const isTracker = location.pathname === '/' || location.pathname === '/tracker';
  const isJobs = location.pathname === '/jobs';
  const isContacts = location.pathname === '/contacts';

  return (
    <Box
      borderBottomWidth="2px"
      borderColor="teal.200"
      bg="linear-gradient(90deg, #ffffff 0%, #f0fdfa 100%)"
      _dark={{ borderColor: 'teal.700', bg: 'linear-gradient(90deg, #1e293b 0%, #0f766e 50%, #134e4a 100%)' }}
      py={3}
      boxShadow="sm"
    >
      <Container maxW="6xl">
        <HStack spacing={6} justify="space-between">
          <HStack spacing={6}>
          <ChakraLink
            as={RouterLink}
            to="/"
            display="flex"
            alignItems="center"
            gap={2}
            fontWeight="bold"
            fontSize="lg"
            color={isTracker ? 'teal.600' : 'gray.600'}
            _dark={{ color: isTracker ? 'teal.300' : 'gray.400' }}
            _hover={{ color: 'teal.500', textDecoration: 'none' }}
          >
            <AppIcon boxSize={8} />
            Offer When
          </ChakraLink>
          <ChakraLink
            as={RouterLink}
            to="/jobs"
            fontWeight="bold"
            fontSize="lg"
            color={isJobs ? 'teal.600' : 'gray.600'}
            _dark={{ color: isJobs ? 'teal.300' : 'gray.400' }}
            _hover={{ color: 'teal.500', textDecoration: 'none' }}
          >
            Jobs
          </ChakraLink>
          <ChakraLink
            as={RouterLink}
            to="/contacts"
            fontWeight="bold"
            fontSize="lg"
            color={isContacts ? 'teal.600' : 'gray.600'}
            _dark={{ color: isContacts ? 'teal.300' : 'gray.400' }}
            _hover={{ color: 'teal.500', textDecoration: 'none' }}
          >
            HR Contacts
          </ChakraLink>
          </HStack>
          <HStack spacing={2}>
            <ResumeManager />
            <Button size="sm" variant="outline" onClick={logout}>
              Log out
            </Button>
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
