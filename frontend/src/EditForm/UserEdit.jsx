import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './Form.css';

const UserEdit = ({ user, onSuccess, onCancel }) => {
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${user._id}`,
        { fullName }, // Only send fullName in the request
        {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      
      localStorage.setItem('flashMessage', JSON.stringify({
        type: 'success',
        message: '✅ Username updated successfully!'
      }));
      
      onSuccess(response.data);
    } catch (error) {
      localStorage.setItem('flashMessage', JSON.stringify({
        type: 'error',
        message: '❌ Failed to update username'
      }));
      window.location.reload();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="edit-form-group">
        <label>Full Name: </label>
        <input
          type="text"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      
      <div className="edit-form-buttons">
        <button 
          type="submit" 
          className="edit-form-save-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
        <button 
          type="button" 
          className="edit-form-cancel-btn"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

UserEdit.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default UserEdit;