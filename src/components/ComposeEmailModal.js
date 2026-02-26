import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ComposeEmailModal({ isOpen, onClose, to = '', subject = '', body = '' }) {
  const [recipient, setRecipient] = useState(to);
  const [emailSubject, setEmailSubject] = useState(subject);
  const [emailBody, setEmailBody] = useState(body);
  const [attachment, setAttachment] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setRecipient(to);
      setEmailSubject(subject);
      setEmailBody(body);
      setAttachment(null);
      setError('');
    }
  }, [isOpen, to, subject, body]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setAttachment(file || null);
    e.target.value = '';
  };

  const handleSend = async () => {
    const toTrim = recipient?.trim();
    if (!toTrim) {
      setError('Recipient email is required.');
      return;
    }
    setError('');
    setSending(true);
    try {
      let attachmentPayload;
      if (attachment) {
        const content = await fileToBase64(attachment);
        attachmentPayload = { filename: attachment.name, content };
      }
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: toTrim,
          subject: emailSubject || '',
          body: emailBody || '',
          attachment: attachmentPayload || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to send email');
        return;
      }
      toast({ title: 'Email sent', status: 'success', duration: 3000, isClosable: true });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent maxH="90vh" display="flex" flexDirection="column">
        <ModalHeader flexShrink={0}>Send email</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto" flex="1" minH={0}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>To</FormLabel>
              <Input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="hr@company.com"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Subject</FormLabel>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Message</FormLabel>
              <Textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Your message..."
                rows={8}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Attach resume (optional)</FormLabel>
              <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={2}>
                Attach your resume so the recipient can open it directly.
              </Text>
              <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              {attachment && (
                <Text fontSize="sm" mt={2} color="teal.600" _dark={{ color: 'teal.400' }}>
                  {attachment.name}
                </Text>
              )}
            </FormControl>
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter flexShrink={0}>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={sending}>
            Cancel
          </Button>
          <Button
            leftIcon={<AttachmentIcon />}
            colorScheme="teal"
            onClick={handleSend}
            isLoading={sending}
            isDisabled={sending}
          >
            Send email
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
