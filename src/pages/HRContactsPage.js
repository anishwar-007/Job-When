import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import * as hrContactsService from '../services/hrContactsService';

export default function HRContactsPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    hrContactsService.getHrContacts().then(({ data, error: err }) => {
      setLoading(false);
      if (err) setError(err.message);
      else setContacts(data || []);
    });
  }, [user]);

  if (loading) {
    return (
      <Box
        minH="100vh"
        py={6}
        px={4}
        bg="linear-gradient(160deg, #f0fdfa 0%, #e0f2fe 50%, #f8fafc 100%)"
        _dark={{ bg: 'linear-gradient(160deg, #0f172a 0%, #134e4a 50%, #0c4a6e 100%)' }}
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
        <Heading size="lg" mb={6} bgGradient="linear(to-r, teal.600, cyan.600)" _dark={{ bgGradient: 'linear(to-r, teal.300, cyan.300)' }} bgClip="text">
          HR Contacts
        </Heading>
        {error && (
          <Text color="red.500" mb={4}>
            {error}
          </Text>
        )}
        {!contacts.length ? (
          <Box
            p={8}
            textAlign="center"
            borderWidth="2px"
            borderRadius="lg"
            borderStyle="dashed"
            borderColor="teal.200"
            bg="white"
            _dark={{ borderColor: 'teal.600', bg: 'gray.800' }}
            boxShadow="sm"
          >
            <Text color="gray.600" _dark={{ color: 'gray.400' }}>
              No HR contacts yet. Run the migration script to import from trackers, or add contacts from the Tracker page.
            </Text>
          </Box>
        ) : (
          <TableContainer
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="teal.100"
            _dark={{ bg: 'gray.800', borderColor: 'teal.800' }}
            boxShadow="sm"
          >
            <Table size="sm" variant="simple">
              <Thead bg="teal.50" _dark={{ bg: 'teal.900' }}>
                <Tr>
                  <Th>Name</Th>
                  <Th>Company Name</Th>
                  <Th>Phone</Th>
                  <Th>Email</Th>
                </Tr>
              </Thead>
              <Tbody>
                {contacts.map((c) => (
                  <Tr key={c.id}>
                    <Td fontWeight="medium">{c.name}</Td>
                    <Td>{c.company_name}</Td>
                    <Td>{c.phone || '—'}</Td>
                    <Td>{c.email || '—'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}
