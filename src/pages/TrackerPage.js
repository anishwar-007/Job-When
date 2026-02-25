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
      <Box minH="100vh" py={6} px={4} bg="gray.50" _dark={{ bg: 'gray.900' }} display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" colorScheme="teal" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" py={6} px={4} bg="gray.50" _dark={{ bg: 'gray.900' }}>
      <Container maxW="6xl">
        <VStack align="stretch" spacing={6}>
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <Button size="sm" ml="auto" variant="ghost" onClick={clearError}>
                Dismiss
              </Button>
            </Alert>
          )}
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <Heading size="lg">Offer When</Heading>
            <Button colorScheme="teal" onClick={handleAdd}>
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
