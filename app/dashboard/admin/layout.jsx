import PrivateRoute from '../../../src/components/PrivateRoute';

export default function AdminLayout({ children }) {
  return <PrivateRoute roles={['admin']}>{children}</PrivateRoute>;
}