'use client'
import { useState, useEffect } from 'react';

const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkDatabaseConnection = async () => {
      try {
        const response = await fetch('/api/status');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.success) {
          setStatus('connected');
        } else {
          setStatus('error');
          setError(data.error || 'Unknown error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('error');
      }
    };

    checkDatabaseConnection();
  }, []);

  return (
    <div>
      <h2>Database Connection Status:</h2>
      {status === 'connected' && <p style={{ color: 'green' }}>Connected successfully!</p>}
      {status === 'error' && (
        <p style={{ color: 'red' }}>Connection error: {error || 'Unknown error'}</p>
      )}
      {status === null && <p>Checking connection...</p>}
    </div>
  );
};

export default DatabaseStatus;
