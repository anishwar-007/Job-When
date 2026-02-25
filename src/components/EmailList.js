import React from 'react';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import EmailCard from './EmailCard';

export default function EmailList({ emails, onEdit, columns = 1 }) {
  if (!emails.length) {
    return (
      <Box
        p={8}
        textAlign="center"
        borderWidth="1px"
        borderRadius="md"
        borderStyle="dashed"
        bg="gray.50"
        _dark={{ bg: 'gray.800' }}
      >
        <Text color="gray.500" _dark={{ color: 'gray.400' }}>
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
