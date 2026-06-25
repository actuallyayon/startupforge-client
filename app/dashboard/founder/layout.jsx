import PrivateRoute from '../../../src/components/PrivateRoute';

export default function FounderLayout({ children }) {
  return <PrivateRoute roles={['founder']}>{children}</PrivateRoute>;
}