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
  Textarea,
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
import { EditIcon, CopyIcon, EmailIcon } from '@chakra-ui/icons';
import StatusSelect from './StatusSelect';
import { useEmailTracker } from '../context/EmailTrackerContext';
import ComposeEmailModal from './ComposeEmailModal';

function isJobLink(value) {
  return (value || '').startsWith('http://') || (value || '').startsWith('https://');
}

export default function EmailCard({ email, onEdit }) {
  const { jobIds, removeEmail, toggleCheck, updateEmail } = useEmailTracker();
  const job = email.jobId
    ? jobIds.find((j) => (typeof j === 'string' ? j : j.value) === email.jobId)
    : null;
  const jobValue = typeof job === 'string' ? job : job?.value;
  const primaryLabel = job
    ? (typeof job === 'string' ? job : job.displayText || job.value)
    : email.jobId;
  const linkJob = jobValue && isJobLink(jobValue);
  const [showContent, setShowContent] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [draftNotes, setDraftNotes] = useState('');
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isComposeOpen, onOpen: onComposeOpen, onClose: onComposeClose } = useDisclosure();
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

  const handleCopy = async (e) => {
    e.stopPropagation();
    const payload = {
      'Hr name': email.hrName || '',
      'company name': email.companyName || '',
      'Job link': email.jobId || jobValue || '',
      'email': email.email || '',
    };
    const text = JSON.stringify(payload, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied to clipboard', status: 'success', duration: 2000, isClosable: true });
    } catch {
      toast({ title: 'Copy failed', status: 'error', duration: 2000, isClosable: true });
    }
  };

  const startEditNotes = (e) => {
    e.stopPropagation();
    setDraftNotes(email.notes || '');
    setEditingNotes(true);
  };

  const cancelEditNotes = (e) => {
    e?.stopPropagation();
    setEditingNotes(false);
    setDraftNotes('');
  };

  const saveNotes = (e) => {
    e?.stopPropagation();
    updateEmail(email.id, { ...email, notes: draftNotes });
    setEditingNotes(false);
    setDraftNotes('');
    toast({ title: 'Note saved', status: 'success', duration: 2000, isClosable: true });
  };

  const handleSendMail = (e) => {
    e.stopPropagation();
    if (!email.email || !email.email.trim()) {
      toast({ title: 'Add HR email address in Details before sending', status: 'error', duration: 3000, isClosable: true });
      return;
    }
    onComposeOpen();
  };

  return (
    <>
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        bg={email.isChecked ? 'gray.100' : 'white'}
        borderColor="teal.100"
        _dark={{ bg: email.isChecked ? 'gray.700' : 'gray.800', borderColor: 'teal.800' }}
        boxShadow="sm"
        opacity={email.isChecked ? 0.85 : 1}
        transition="all 0.2s"
        cursor="pointer"
        onClick={handleCardClick}
        _hover={{ boxShadow: 'md', borderColor: 'teal.200', _dark: { borderColor: 'teal.600' } }}
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
            {email.status === 'Mail ready' && (
              <Button
                size="sm"
                colorScheme="teal"
                leftIcon={<EmailIcon />}
                onClick={handleSendMail}
                title="Open default mail app to send email to HR"
              >
                Send the mail
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              leftIcon={<CopyIcon />}
              onClick={handleCopy}
              title="Copy HR name, company, job link, email as JSON"
            >
              Copy
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<EditIcon />}
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

        <Box mt={3} onClick={(e) => e.stopPropagation()} borderTopWidth="1px" borderColor="teal.100" _dark={{ borderColor: 'teal.700' }} pt={3}>
          <Text fontSize="xs" fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.400' }} mb={2}>
            Notes
          </Text>
          {editingNotes ? (
            <>
              <Textarea
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                placeholder="Note down what was discussed or concluded..."
                size="sm"
                rows={3}
                mb={2}
                focusBorderColor="teal.400"
              />
              <Flex gap={2}>
                <Button size="sm" colorScheme="teal" onClick={saveNotes}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={cancelEditNotes}>
                  Cancel
                </Button>
              </Flex>
            </>
          ) : (
            <>
              <Text fontSize="sm" whiteSpace="pre-wrap" color="gray.700" _dark={{ color: 'gray.300' }}>
                {email.notes?.trim() || 'No notes yet.'}
              </Text>
              <Button size="xs" variant="link" colorScheme="teal" mt={1} leftIcon={<EditIcon />} onClick={startEditNotes}>
                Edit note
              </Button>
            </>
          )}
        </Box>
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

      <ComposeEmailModal
        isOpen={isComposeOpen}
        onClose={onComposeClose}
        to={email.email || ''}
        subject={email.emailHeader || ''}
        body={email.emailContent || ''}
      />
    </>
  );
}
