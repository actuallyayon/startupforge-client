import DashboardLayout from '../../src/components/dashboard/DashboardLayout';
import PrivateRoute from '../../src/components/PrivateRoute';

export default function Layout({ children }) {
  return (
    <PrivateRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </PrivateRoute>
  );
}
