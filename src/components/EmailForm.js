import React, { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
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
  Select,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { DEFAULT_STATUSES } from '../constants/statuses';
import { useEmailTracker } from '../context/EmailTrackerContext';

const emptyRecord = {
  hrName: '',
  companyName: '',
  email: '',
  phone: '',
  hasEmail: true,
  jobId: '',
  emailHeader: '',
  emailContent: '',
  status: 'Just added',
};

export default function EmailForm({ isOpen, onClose, editRecord = null }) {
  const { addEmail, updateEmail, jobIds } = useEmailTracker();
  const isEditing = Boolean(editRecord?.id);
  const [form, setForm] = useState(emptyRecord);

  useEffect(() => {
    if (editRecord) {
      setForm({
        hrName: editRecord.hrName || '',
        companyName: editRecord.companyName || '',
        email: editRecord.email || '',
        phone: editRecord.phone || '',
        hasEmail: editRecord.hasEmail !== false,
        jobId: editRecord.jobId || '',
        emailHeader: editRecord.emailHeader || '',
        emailContent: editRecord.emailContent || '',
        status: editRecord.status || 'Just added',
      });
    } else {
      setForm(emptyRecord);
    }
  }, [editRecord, isOpen]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = isEditing
      ? await updateEmail(editRecord.id, form)
      : await addEmail(form);
    if (ok) {
      setForm(emptyRecord);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? 'Edit email' : 'Add email'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>HR name</FormLabel>
                <Input
                  value={form.hrName}
                  onChange={(e) => handleChange('hrName', e.target.value)}
                  placeholder="HR contact name"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Company name</FormLabel>
                <Input
                  value={form.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="Company name"
                />
              </FormControl>
              <FormControl>
                <Checkbox
                  isChecked={form.hasEmail}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    handleChange('hasEmail', checked);
                    if (!checked) handleChange('email', '');
                  }}
                  colorScheme="teal"
                >
                  I have the HR&apos;s email address
                </Checkbox>
              </FormControl>
              {form.hasEmail && (
                <FormControl isRequired>
                  <FormLabel>HR email</FormLabel>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="hr@company.com"
                  />
                </FormControl>
              )}
              <FormControl>
                <FormLabel>Phone {!form.hasEmail && '(at least phone or email)'}</FormLabel>
                <Input
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Phone number"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Job ID or job link</FormLabel>
                <Select
                  value={form.jobId}
                  onChange={(e) => handleChange('jobId', e.target.value)}
                  placeholder="Select job ID or link"
                >
                  {jobIds.map((job) => {
                    const item = typeof job === 'string' ? { value: job, displayText: '' } : job;
                    const label = item.displayText || item.value;
                    return (
                      <option key={item.value} value={item.value}>
                        {label}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  {DEFAULT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Email header (subject line)</FormLabel>
                <Input
                  value={form.emailHeader}
                  onChange={(e) => handleChange('emailHeader', e.target.value)}
                  placeholder="e.g. Application for Software Engineer role"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email content (what you sent)</FormLabel>
                <Textarea
                  value={form.emailContent}
                  onChange={(e) => handleChange('emailContent', e.target.value)}
                  placeholder="Paste or type the email you sent to HR..."
                  rows={6}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="teal">
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
