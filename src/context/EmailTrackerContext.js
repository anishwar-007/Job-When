import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import * as jobsService from '../services/jobsService';
import * as trackersService from '../services/trackersService';
import * as hrContactsService from '../services/hrContactsService';

const EmailTrackerContext = createContext(null);

export function EmailTrackerProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [emails, setEmails] = useState([]);
  const [jobIds, setJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadedForUser = useRef(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [jobsRes, trackersRes] = await Promise.all([
      jobsService.getJobs(),
      trackersService.getTrackers(),
    ]);
    if (jobsRes.error) {
      setError(jobsRes.error.message);
      setJobIds([]);
    } else {
      setJobIds(jobsRes.data || []);
    }
    if (trackersRes.error) {
      setError(trackersRes.error.message);
      setEmails([]);
    } else {
      setEmails(trackersRes.data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (userId) {
      if (loadedForUser.current === userId) return;
      loadedForUser.current = userId;
      loadData();
    } else {
      loadedForUser.current = null;
      setEmails([]);
      setJobIds([]);
      setLoading(false);
    }
  }, [userId, loadData]);

  const addEmail = useCallback(
    async (record) => {
      const { data, error: err } = await trackersService.createTracker({
        ...record,
        isChecked: false,
      });
      if (err) {
        setError(err.message);
        return false;
      }
      if (data) {
        setEmails((prev) => [data, ...prev]);
        await hrContactsService.ensureHrContactFromTracker(data);
      }
      return true;
    },
    []
  );

  const updateEmail = useCallback(async (id, updates) => {
    const current = emails.find((e) => e.id === id);
    if (!current) return false;
    const merged = { ...current, ...updates };
    const { data, error: err } = await trackersService.updateTracker(id, merged);
    if (err) {
      setError(err.message);
      return false;
    }
    if (data) {
      setEmails((prev) => prev.map((e) => (e.id === id ? data : e)));
      await hrContactsService.ensureHrContactFromTracker(data);
    }
    return true;
  }, [emails]);

  const removeEmail = useCallback(async (id) => {
    const { error: err } = await trackersService.deleteTracker(id);
    if (err) {
      setError(err.message);
      return false;
    }
    setEmails((prev) => prev.filter((e) => e.id !== id));
    return true;
  }, []);

  const toggleCheck = useCallback(
    async (id) => {
      const current = emails.find((e) => e.id === id);
      if (!current) return;
      await updateEmail(id, { isChecked: !current.isChecked });
    },
    [emails, updateEmail]
  );

  const addJobId = useCallback(async (value, displayText = '') => {
    const trimmed = (value || '').trim();
    if (!trimmed) return false;
    const exists = jobIds.some((j) => j.value === trimmed);
    if (exists) return true;
    const { data, error: err } = await jobsService.createJob({
      value: trimmed,
      displayText: (displayText || '').trim(),
      closed: false,
    });
    if (err) {
      setError(err.message);
      return false;
    }
    if (data) setJobIds((prev) => [data, ...prev]);
    return true;
  }, [jobIds]);

  const removeJobId = useCallback(async (value) => {
    const job = jobIds.find((j) => j.value === value);
    if (!job) return false;
    const { error: err } = await jobsService.deleteJob(job.id);
    if (err) {
      setError(err.message);
      return false;
    }
    setJobIds((prev) => prev.filter((j) => j.value !== value));
    return true;
  }, [jobIds]);

  const setJobClosed = useCallback(
    async (value, closed) => {
      const job = jobIds.find((j) => j.value === value);
      if (!job) return;
      const { data, error: err } = await jobsService.updateJob(job.id, {
        status: closed ? 'closed' : 'open',
      });
      if (err) {
        setError(err.message);
        return;
      }
      if (data)
        setJobIds((prev) =>
          prev.map((j) => (j.value === value ? { ...j, closed: data.closed } : j))
        );
    },
    [jobIds]
  );

  const clearError = useCallback(() => setError(null), []);

  const value = {
    emails,
    jobIds,
    loading,
    error,
    clearError,
    loadData,
    addEmail,
    updateEmail,
    removeEmail,
    toggleCheck,
    addJobId,
    removeJobId,
    setJobClosed,
  };

  return (
    <EmailTrackerContext.Provider value={value}>
      {children}
    </EmailTrackerContext.Provider>
  );
}

export function useEmailTracker() {
  const ctx = useContext(EmailTrackerContext);
  if (!ctx) throw new Error('useEmailTracker must be used within EmailTrackerProvider');
  return ctx;
}
