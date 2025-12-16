'use client';

import { useEffect, useState } from 'react';
import { fetchHealth, type HealthStatus as HealthStatusType } from '@/lib/api';
import styles from './HealthStatus.module.css';

export function HealthStatus() {
  const [health, setHealth] = useState<HealthStatusType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await fetchHealth();
        setHealth(data);
        setError(null);
      } catch (err) {
        setError('API is not reachable. Make sure the API server is running on port 8000.');
        setHealth(null);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className={styles.loading}>Checking API health...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <span className={styles.indicator} data-status="error" />
        {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.status}>
        <span className={styles.indicator} data-status={health?.status} />
        <span>Status: {health?.status?.toUpperCase()}</span>
      </div>
      <div className={styles.details}>
        <p>Runtime: {health?.runtime}</p>
        <p>Version: {health?.version}</p>
        <p>Last Check: {health?.timestamp && new Date(health.timestamp).toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
