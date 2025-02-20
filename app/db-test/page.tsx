// pages/minha-pagina.tsx
import DatabaseStatus from '@/components/db-status';

const DbStatus: React.FC = () => {
  return (
    <div>
      <h1>Welcome to my page</h1>
      <DatabaseStatus />
      
    </div>
  );
};

export default DbStatus;