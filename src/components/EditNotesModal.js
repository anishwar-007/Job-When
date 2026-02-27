import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react';

export default function EditNotesModal({ isOpen, onClose, contactName = '', notes = '', onSave }) {
  const [value, setValue] = useState(notes);

  useEffect(() => {
    if (isOpen) setValue(notes);
  }, [isOpen, notes]);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent
        bg="white"
        _dark={{ bg: 'gray.800' }}
        borderWidth="1px"
        borderColor="teal.200"
        _dark={{ borderColor: 'teal.600' }}
        boxShadow="xl"
      >
        <ModalHeader>Edit note {contactName ? `— ${contactName}` : ''}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Note down what was discussed or concluded on a call..."
            rows={6}
            resize="vertical"
            focusBorderColor="teal.400"
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="teal" onClick={handleSave}>
            Save note
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
