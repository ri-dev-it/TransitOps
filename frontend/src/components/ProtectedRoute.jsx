import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (roles && roles.length && !roles.includes(user.role)) {
    return (
      <div className="p-8">
        <div className="card p-6 max-w-lg mx-auto text-center">
          <h2 className="text-lg font-semibold mb-2">Access restricted</h2>
          <p className="text-sm text-ink-700">Your role does not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
