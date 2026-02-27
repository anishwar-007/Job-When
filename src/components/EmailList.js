import React from 'react';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import EmailCard from './EmailCard';

export default function EmailList({ emails, onEdit, columns = 1 }) {
  if (!emails.length) {
    return (
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
          No emails yet. Click &quot;Add email&quot; to track your first HR email.
        </Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: columns }} spacing={3}>
      {emails.map((email) => (
        <EmailCard key={email.id} email={email} onEdit={onEdit} />
      ))}
    </SimpleGrid>
  );
}
