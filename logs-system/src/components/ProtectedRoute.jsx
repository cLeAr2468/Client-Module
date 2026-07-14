import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';

/**
 * Protected Route Component
 * 
 * Wraps components that require authentication.
 * Redirects to login if user is not authenticated.
 * Saves the attempted URL to redirect back after login.
 * 
 * Usage:
 * <Route 
 *   path="/dashboard" 
 *   element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   } 
 * />
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Save the current location they were trying to access
    localStorage.setItem('redirectAfterLogin', location.pathname);
    
    // Redirect to login page
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  // User is authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
