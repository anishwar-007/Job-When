import React, { useState, useEffect, useRef } from 'react';
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
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { AttachmentIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import * as profileService from '../services/profileService';

export default function ResumeManager() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoading(true);
    profileService.getProfile().then(({ data, error }) => {
      if (cancelled) return;
      setLoading(false);
      if (error) {
        toast({ title: error.message || 'Failed to load profile', status: 'error', isClosable: true });
        return;
      }
      setProfile(data);
    });
    return () => { cancelled = true; };
  }, [isOpen, toast]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { data, error } = await profileService.uploadResume(file);
    setUploading(false);
    e.target.value = '';
    if (error) {
      toast({ title: error.message || 'Upload failed', status: 'error', isClosable: true });
      return;
    }
    setProfile(data);
    toast({ title: 'Resume uploaded', status: 'success', duration: 2000, isClosable: true });
  };

  const handleView = async () => {
    const { data: url, error } = await profileService.getResumeViewUrl();
    if (error || !url) {
      toast({ title: error?.message || 'Could not open resume', status: 'error', isClosable: true });
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasResume = profile?.resumePath;
  const updatedAt = profile?.resumeUpdatedAt
    ? new Date(profile.resumeUpdatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    : null;

  return (
    <>
      <Button size="sm" variant="outline" leftIcon={<AttachmentIcon />} onClick={onOpen}>
        Resume
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent maxH="90vh" display="flex" flexDirection="column">
          <ModalHeader flexShrink={0}>My resume</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto" flex="1" minH={0}>
            {loading ? (
              <Text color="gray.500">Loading…</Text>
            ) : (
              <VStack align="stretch" spacing={4}>
                {hasResume ? (
                  <>
                    {updatedAt && (
                      <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                        Last updated: {updatedAt}
                      </Text>
                    )}
                    <Button
                      leftIcon={<ExternalLinkIcon />}
                      colorScheme="teal"
                      variant="outline"
                      onClick={handleView}
                      w="full"
                    >
                      View resume
                    </Button>
                  </>
                ) : (
                  <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                    No resume uploaded yet.
                  </Text>
                )}
                <FormControl>
                  <FormLabel>{hasResume ? 'Re-upload resume' : 'Upload resume'}</FormLabel>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    isDisabled={uploading}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter flexShrink={0}>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
