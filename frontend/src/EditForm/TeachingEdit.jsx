import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const TeachingEdit = ({ teaching, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtube: '',
    _id: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (teaching) {
      setFormData({
        title: teaching.title || '',
        description: teaching.description || '',
        youtube: teaching.youtube || '',
        _id: teaching._id || ''
      });
    }
  }, [teaching]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const updatedTeaching = { ...formData };
      
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/teaching/${formData._id}`,
        updatedTeaching,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      
      localStorage.setItem('flashMessage', JSON.stringify({
        type: 'success',
        message: '✅ Teaching video updated successfully!'
      }));
      
      onSuccess(response.data);
    } catch (error) {
      localStorage.setItem('flashMessage', JSON.stringify({
        type: 'error',
        message: '❌ Failed to update teaching video'
      }));
      window.location.reload();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="edit-form-group">
        <label>Title: </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="edit-form-group">
        <label>Description: </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
        />
      </div>
      
      <div className="edit-form-group">
        <label>YouTube URL: </label>
        <input
          type="url"
          name="youtube"
          value={formData.youtube}
          onChange={handleChange}
          required
          placeholder="https://www.youtube.com/watch?v=..."
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

TeachingEdit.propTypes = {
  teaching: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    youtube: PropTypes.string
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default TeachingEdit;