import React, { useState, useMemo } from 'react';
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
  Link,
  Spinner,
  Switch,
  Tag,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEmailTracker } from '../context/EmailTrackerContext';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
];

function isJobLink(value) {
  return (value || '').startsWith('http://') || (value || '').startsWith('https://');
}

export default function JobsPage() {
  const { jobIds, setJobClosed, loading, error, clearError } = useEmailTracker();
  const [filter, setFilter] = useState('all');

  const normalized = useMemo(
    () =>
      jobIds.map((j) =>
        typeof j === 'string'
          ? { value: j, displayText: '', closed: false }
          : { value: j.value, displayText: j.displayText || '', closed: j.closed === true }
      ),
    [jobIds]
  );

  const filtered = useMemo(() => {
    if (filter === 'open') return normalized.filter((j) => !j.closed);
    if (filter === 'closed') return normalized.filter((j) => j.closed);
    return normalized;
  }, [normalized, filter]);

  if (loading) {
    return (
      <Box minH="100vh" py={6} px={4} bg="gray.50" _dark={{ bg: 'gray.900' }} display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" colorScheme="teal" />
      </Box>
    );
  }

  if (!normalized.length) {
    return (
      <Box minH="100vh" py={6} px={4} bg="gray.50" _dark={{ bg: 'gray.900' }}>
        <Container maxW="4xl">
          <Heading size="lg" mb={6}>
            Jobs
          </Heading>
          {error && (
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <Button size="sm" ml="auto" variant="ghost" onClick={clearError}>
                Dismiss
              </Button>
            </Alert>
          )}
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
              No jobs yet. Add job IDs or links from the Tracker page (Manage Job IDs / Links).
            </Text>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" py={6} px={4} bg="gray.50" _dark={{ bg: 'gray.900' }}>
      <Container maxW="4xl">
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
          <Heading size="lg">Jobs</Heading>

          <HStack spacing={2} flexWrap="wrap">
            <Text fontSize="sm" fontWeight="medium" color="gray.600" _dark={{ color: 'gray.400' }}>
              Filter:
            </Text>
            {FILTER_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                size="sm"
                variant={filter === opt.value ? 'solid' : 'outline'}
                colorScheme="teal"
                onClick={() => setFilter(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </HStack>

          <VStack align="stretch" spacing={3}>
            {filtered.map((job) => {
              const isLink = isJobLink(job.value);
              const label = job.displayText || job.value;
              return (
                <Box
                  key={job.value}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="gray.50"
                  _dark={{ bg: 'gray.800' }}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap={3}
                >
                  <Box minW={0} flex="1">
                    <HStack spacing={2} flexWrap="wrap">
                      <Tag size="md" colorScheme={job.closed ? 'gray' : isLink ? 'blue' : 'teal'}>
                        <TagLabel>{label}</TagLabel>
                      </Tag>
                      {isLink && (
                        <Link href={job.value} isExternal fontSize="sm" color="teal.600" _dark={{ color: 'teal.300' }}>
                          Open link
                        </Link>
                      )}
                    </HStack>
                    {job.displayText && job.value !== job.displayText && (
                      <Text fontSize="xs" color="gray.500" mt={1} noOfLines={1}>
                        {job.value}
                      </Text>
                    )}
                  </Box>
                  <HStack spacing={2} align="center">
                    <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                      {job.closed ? 'Closed' : 'Open'}
                    </Text>
                    <Switch
                      size="md"
                      colorScheme="teal"
                      isChecked={!job.closed}
                      onChange={() => setJobClosed(job.value, !job.closed)}
                      aria-label={job.closed ? 'Mark as open' : 'Mark as closed'}
                    />
                  </HStack>
                </Box>
              );
            })}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
