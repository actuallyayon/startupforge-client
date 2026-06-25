import PrivateRoute from '../../../src/components/PrivateRoute';

export default function CollaboratorLayout({ children }) {
  return <PrivateRoute roles={['collaborator']}>{children}</PrivateRoute>;
}