// pages/admin/index.tsx
import { AuthWrapper } from '../../components/AuthWrapper';
import AdminPanel from '../..//components/AdminPanel';

const AdminPage = () => {
  return (
    <AuthWrapper>
      <AdminPanel />
    </AuthWrapper>
  );
};

export default AdminPage;