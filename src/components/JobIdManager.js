import React, { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
  Heading,
  Wrap,
  WrapItem,
  VStack,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useEmailTracker } from '../context/EmailTrackerContext';

function isJobLink(value) {
  const v = (value || '').trim();
  return v.startsWith('http://') || v.startsWith('https://');
}

export default function JobIdManager() {
  const { jobIds, addJobId, removeJobId } = useEmailTracker();
  const [inputValue, setInputValue] = useState('');
  const [displayText, setDisplayText] = useState('');
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });

  const handleAdd = async () => {
    const ok = await addJobId(inputValue, displayText);
    if (ok) {
      setInputValue('');
      setDisplayText('');
    }
  };

  const normalizedJobs = jobIds.map((j) =>
    typeof j === 'string' ? { value: j, displayText: '' } : { value: j.value, displayText: j.displayText || '' }
  );

  return (
    <Box mb={4}>
      <Button
        size="sm"
        variant="ghost"
        rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        onClick={onToggle}
      >
        Manage Job IDs / Links
      </Button>
      <Collapse in={isOpen} animateOpacity>
        <Box
          mt={2}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          borderColor="teal.100"
          _dark={{ borderColor: 'teal.800' }}
          bg="white"
          _dark={{ bg: 'gray.800' }}
          boxShadow="sm"
        >
          <Heading size="sm" mb={3}>
            Job IDs / Job links
          </Heading>
          <VStack align="stretch" spacing={3} mb={4} maxW="xl">
            <FormControl>
              <FormLabel fontSize="sm">Job ID or job link</FormLabel>
              <Input
                size="sm"
                placeholder="e.g. REQ-123 or https://company.com/careers/..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Display text (primary label on chips)</FormLabel>
              <InputGroup size="sm">
                <Input
                  placeholder="e.g. Senior Engineer - Marketing"
                  value={displayText}
                  onChange={(e) => setDisplayText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
                />
                <InputRightElement width="auto">
                  <IconButton
                    size="sm"
                    aria-label="Add"
                    icon={<AddIcon />}
                    onClick={handleAdd}
                    colorScheme="teal"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </VStack>
          <Wrap spacing={2}>
            {normalizedJobs.map((job) => {
              const isLink = isJobLink(job.value);
              const primaryLabel = job.displayText || job.value;
              return (
                <WrapItem key={job.value}>
                  <Tag
                    size="md"
                    colorScheme={isLink ? 'blue' : 'teal'}
                    maxW="full"
                  >
                    <TagLabel
                      title={job.value}
                      noOfLines={1}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      maxW="280px"
                    >
                      {primaryLabel}
                    </TagLabel>
                    <TagCloseButton onClick={() => removeJobId(job.value)} />
                  </Tag>
                </WrapItem>
              );
            })}
            {normalizedJobs.length === 0 && (
              <Box color="gray.500" fontSize="sm">
                No job IDs or links yet. Add one above; use display text to show a short label (especially for links).
              </Box>
            )}
          </Wrap>
        </Box>
      </Collapse>
    </Box>
  );
}
