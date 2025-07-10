
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { authUser } = useSelector((state) => state.user);
  return authUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
