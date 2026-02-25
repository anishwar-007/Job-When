import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import AppIcon from './AppIcon';

function GoogleIcon({ boxSize = 5 }) {
  return (
    <Box as="span" display="inline-flex" alignItems="center" justifyContent="center" boxSize={boxSize} flexShrink={0}>
      <svg width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    </Box>
  );
}

export default function Login() {
  const { loginWithGoogle, error } = useAuth();

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      py={12}
      position="relative"
      overflow="hidden"
    >
      {/* Dynamic gradient background */}
      <Box
        position="absolute"
        inset={0}
        bg="gray.900"
        sx={{
          background: [
            'linear-gradient(135deg, #0f766e 0%, transparent 50%)',
            'linear-gradient(225deg, #134e4a 0%, transparent 50%)',
            'linear-gradient(45deg, #115e59 0%, transparent 40%)',
            'linear-gradient(315deg, #0d9488 0%, transparent 45%)',
          ].join(', '),
          animation: 'loginGradient 14s ease-in-out infinite',
        }}
      />
      {/* Animated orbs */}
      <Box
        position="absolute"
        top="10%"
        left="15%"
        w="280px"
        h="280px"
        borderRadius="full"
        bg="teal.500"
        opacity={0.15}
        filter="blur(60px)"
        animation="loginFloat 18s ease-in-out infinite"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="10%"
        w="320px"
        h="320px"
        borderRadius="full"
        bg="cyan.400"
        opacity={0.12}
        filter="blur(70px)"
        animation="loginFloat 22s ease-in-out infinite reverse"
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        w="200px"
        h="200px"
        borderRadius="full"
        bg="teal.300"
        opacity={0.08}
        filter="blur(50px)"
        animation="loginFloat 15s ease-in-out infinite"
        transform="translate(-50%, -50%)"
      />
      {/* Subtle grid overlay */}
      <Box
        position="absolute"
        inset={0}
        bgImage="linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)"
        bgSize="48px 48px"
        pointerEvents="none"
      />

      <Box position="relative" zIndex={1} w="full">
        <Container maxW="md">
          <Box
            bg="white"
            _dark={{ bg: 'gray.800' }}
            borderRadius="2xl"
            boxShadow="2xl"
            _dark={{ boxShadow: 'dark-lg', borderWidth: '1px', borderColor: 'gray.700' }}
            p={8}
          >
            <VStack spacing={7} align="stretch">
              <VStack spacing={4}>
                <HStack spacing={3}>
                  <AppIcon boxSize={12} />
                  <Heading size="xl" color="teal.700" _dark={{ color: 'teal.300' }}>
                    Offer When
                  </Heading>
                </HStack>
                <Text color="gray.600" _dark={{ color: 'gray.400' }} textAlign="center" fontSize="sm">
                  Sign in to track your job applications and HR contacts in one place.
                </Text>
              </VStack>

              {error && (
                <Alert status="error" borderRadius="md" size="sm">
                  <AlertIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                size="lg"
                width="full"
                onClick={loginWithGoogle}
                leftIcon={<GoogleIcon boxSize={5} />}
                bg="white"
                color="gray.800"
                borderWidth="1px"
                borderColor="gray.300"
                _dark={{ bg: 'gray.700', color: 'white', borderColor: 'gray.600' }}
                _hover={{
                  bg: 'gray.50',
                  _dark: { bg: 'gray.600' },
                  borderColor: 'gray.400',
                  _dark: { borderColor: 'gray.500' },
                }}
                _active={{ bg: 'gray.100', _dark: { bg: 'gray.500' } }}
              >
                Sign in with Google
              </Button>

              <Text fontSize="xs" color="gray.500" _dark={{ color: 'gray.500' }} textAlign="center">
                Your data is stored securely and only you can access it.
              </Text>
            </VStack>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}
