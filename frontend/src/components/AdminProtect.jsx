import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProtect = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
          { withCredentials: true }
        );
        setUser(data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Error verifying admin status');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading admin verification...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <Navigate to="/login" replace />
      </div>
    );
  }

  const adminIds = import.meta.env.VITE_ADMIN_IDS?.split(',') || [];
  if (!user?.googleId || !adminIds.includes(user.googleId)) {
    return (
      <div className="error-message">
        You don't have admin privileges
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
};

export default AdminProtect;