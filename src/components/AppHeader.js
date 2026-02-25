import React from 'react';
import { Box, Button, Container, HStack, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppIcon from './AppIcon';

export default function AppHeader() {
  const location = useLocation();
  const { logout } = useAuth();
  const isTracker = location.pathname === '/' || location.pathname === '/tracker';
  const isJobs = location.pathname === '/jobs';

  return (
    <Box borderBottomWidth="1px" bg="white" _dark={{ bg: 'gray.800' }} py={3}>
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
          </HStack>
          <Button size="sm" variant="outline" onClick={logout}>
            Log out
          </Button>
        </HStack>
      </Container>
    </Box>
  );
}
