import React, { useState } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { useEmailTracker } from '../context/EmailTrackerContext';
import EmailForm from '../components/EmailForm';
import EmailList from '../components/EmailList';
import JobIdManager from '../components/JobIdManager';

const COLUMN_OPTIONS = [1, 2, 3, 4];

export default function TrackerPage() {
  const { emails, loading, error, clearError } = useEmailTracker();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingEmail, setEditingEmail] = useState(null);
  const [columns, setColumns] = useState(2);

  const handleAdd = () => {
    setEditingEmail(null);
    onOpen();
  };

  const handleEdit = (email) => {
    setEditingEmail(email);
    onOpen();
  };

  const handleCloseModal = () => {
    setEditingEmail(null);
    onClose();
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        py={6}
        px={4}
        bg="linear-gradient(160deg, #f0fdfa 0%, #e0f2fe 50%, #f8fafc 100%)"
        _dark={{ bg: 'linear-gradient(160deg, #0f172a 0%, #134e4a 40%, #0c4a6e 100%)' }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" colorScheme="teal" />
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      py={6}
      px={4}
      bg="linear-gradient(160deg, #f0fdfa 0%, #e0f2fe 30%, #f8fafc 70%, #ecfdf5 100%)"
      _dark={{ bg: 'linear-gradient(160deg, #0f172a 0%, #134e4a 35%, #0c4a6e 65%, #14532d 100%)' }}
    >
      <Container maxW="6xl">
        <VStack align="stretch" spacing={6}>
          {error && (
            <Alert status="error" borderRadius="lg" boxShadow="md">
              <AlertIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <Button size="sm" ml="auto" variant="ghost" onClick={clearError}>
                Dismiss
              </Button>
            </Alert>
          )}
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <Heading size="lg" bgGradient="linear(to-r, teal.600, cyan.600)" _dark={{ bgGradient: 'linear(to-r, teal.300, cyan.300)' }} bgClip="text">
              Offer When
            </Heading>
            <Button colorScheme="teal" onClick={handleAdd} boxShadow="md" _hover={{ boxShadow: 'lg', transform: 'translateY(-1px)' }} transition="all 0.2s">
              Add email
            </Button>
          </HStack>

          <HStack spacing={4} align="center" flexWrap="wrap">
            <Box as="span" fontSize="sm" fontWeight="medium" color="gray.600" _dark={{ color: 'gray.400' }}>
              Columns:
            </Box>
            {COLUMN_OPTIONS.map((n) => (
              <Button
                key={n}
                size="sm"
                variant={columns === n ? 'solid' : 'outline'}
                colorScheme="teal"
                onClick={() => setColumns(n)}
              >
                {n}
              </Button>
            ))}
          </HStack>

          <JobIdManager />

          <EmailList emails={emails} onEdit={handleEdit} columns={columns} />
        </VStack>
      </Container>

      <EmailForm
        isOpen={isOpen}
        onClose={handleCloseModal}
        editRecord={editingEmail}
      />
    </Box>
  );
}
