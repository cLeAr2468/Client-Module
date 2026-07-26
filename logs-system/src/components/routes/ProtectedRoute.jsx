import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('auth_token');
    return !!token; // Returns true if token exists, false otherwise
  };

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default ProtectedRoute;
