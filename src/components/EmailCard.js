import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Link,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
  Collapse,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import StatusSelect from './StatusSelect';
import { useEmailTracker } from '../context/EmailTrackerContext';

function isJobLink(value) {
  return (value || '').startsWith('http://') || (value || '').startsWith('https://');
}

export default function EmailCard({ email, onEdit }) {
  const { jobIds, removeEmail, toggleCheck } = useEmailTracker();
  const job = email.jobId
    ? jobIds.find((j) => (typeof j === 'string' ? j : j.value) === email.jobId)
    : null;
  const jobValue = typeof job === 'string' ? job : job?.value;
  const primaryLabel = job
    ? (typeof job === 'string' ? job : job.displayText || job.value)
    : email.jobId;
  const linkJob = jobValue && isJobLink(jobValue);
  const [showContent, setShowContent] = useState(false);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const toast = useToast();

  const handleCardClick = (e) => {
    if (e.target.closest('button, input, select, a')) return;
    onEdit(email);
  };

  const handleDelete = async () => {
    const ok = await removeEmail(email.id);
    if (ok) {
      onDeleteClose();
      toast({ title: 'Removed', status: 'info', duration: 2000, isClosable: true });
    }
  };

  return (
    <>
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="md"
        bg={email.isChecked ? 'gray.100' : 'gray.50'}
        _dark={{ bg: email.isChecked ? 'gray.700' : 'gray.800' }}
        opacity={email.isChecked ? 0.85 : 1}
        transition="opacity 0.2s"
        cursor="pointer"
        onClick={handleCardClick}
        _hover={{ shadow: 'md' }}
      >
        <Flex align="center" gap={3} flexWrap="wrap">
          <Box onClick={(e) => e.stopPropagation()}>
            <Checkbox
              isChecked={email.isChecked}
              onChange={() => toggleCheck(email.id)}
              aria-label="Mark as done"
              colorScheme="teal"
            />
          </Box>
          <Box flex="1" minW="0">
            <Text fontWeight="bold" fontSize="md" noOfLines={1}>
              {email.hrName}
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} noOfLines={1}>
              {email.companyName}
              {email.jobId && primaryLabel && (
                <Box as="span" ml={1} display="inline-flex" alignItems="center">
                  <Tag size="sm" colorScheme={linkJob ? 'blue' : 'teal'} ml={1}>
                    {linkJob ? (
                      <Link href={jobValue} isExternal _hover={{ textDecoration: 'none', opacity: 0.9 }}>
                        {primaryLabel}
                      </Link>
                    ) : (
                      <TagLabel>{primaryLabel}</TagLabel>
                    )}
                  </Tag>
                </Box>
              )}
            </Text>
          </Box>
          <Box onClick={(e) => e.stopPropagation()}>
            <StatusSelect emailId={email.id} value={email.status} />
          </Box>
          <Flex gap={2} shrink={0} onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<ViewIcon />}
              onClick={(e) => { e.stopPropagation(); onEdit(email); }}
              title="View and edit all details"
            >
              Details
            </Button>
            <Button size="sm" colorScheme="red" variant="outline" onClick={onDeleteOpen}>
              Delete
            </Button>
          </Flex>
        </Flex>
        {(email.phone || email.email || email.hasEmail === false) && (
          <Text fontSize="xs" mt={2} color="gray.500" _dark={{ color: 'gray.500' }}>
            {[email.hasEmail === false ? 'No email' : email.email || null, email.phone]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        )}
        {email.emailContent && (
          <Box mt={2} onClick={(e) => e.stopPropagation()}>
            <Button
              size="xs"
              variant="link"
              onClick={() => setShowContent(!showContent)}
            >
              {showContent ? 'Hide email' : 'Show email content'}
            </Button>
            <Collapse in={showContent}>
              <Box
                mt={2}
                p={3}
                bg="gray.100"
                _dark={{ bg: 'gray.700' }}
                borderRadius="md"
                fontSize="sm"
                whiteSpace="pre-wrap"
              >
                {email.emailContent}
              </Box>
            </Collapse>
          </Box>
        )}
      </Box>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Remove this email?</AlertDialogHeader>
            <AlertDialogBody>
              This will remove the entry for {email.hrName} at {email.companyName}. This cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
