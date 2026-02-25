import React from 'react';
import { Select } from '@chakra-ui/react';
import { DEFAULT_STATUSES } from '../constants/statuses';
import { useEmailTracker } from '../context/EmailTrackerContext';

export default function StatusSelect({ emailId, value, size = 'sm' }) {
  const { updateEmail } = useEmailTracker();

  const handleChange = (e) => {
    updateEmail(emailId, { status: e.target.value });
  };

  return (
    <Select
      size={size}
      value={value}
      onChange={handleChange}
      maxW="180px"
      aria-label="Update status"
    >
      {DEFAULT_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </Select>
  );
}
