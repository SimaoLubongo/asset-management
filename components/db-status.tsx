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
          setError(data.error || 'Erro desconhecido');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setStatus('error');
      }
    };

    checkDatabaseConnection();
  }, []);

  return (
    <div>
      <h2>Status da Conexão com o Banco de Dados:</h2>
      {status === 'connected' && <p style={{ color: 'green' }}>Conectado com sucesso!</p>}
      {status === 'error' && (
        <p style={{ color: 'red' }}>Erro na conexão: {error || 'Erro desconhecido'}</p>
      )}
      {status === null && <p>Verificando conexão...</p>}
    </div>
  );
};

export default DatabaseStatus;
