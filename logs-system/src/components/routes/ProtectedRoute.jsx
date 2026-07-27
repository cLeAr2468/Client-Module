import { Navigate } from 'react-router-dom';
import { isSessionActive } from '@/utils/session';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    return isSessionActive();
  };

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default ProtectedRoute;
