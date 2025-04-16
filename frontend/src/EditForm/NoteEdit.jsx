import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './Form.css';

const NoteEdit = ({ note, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imgSrc: '',
    downloadNotesSrc: '',
    _id: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        description: note.description || '',
        imgSrc: note.imgSrc || '',
        downloadNotesSrc: note.downloadNotesSrc || '',
        _id: note._id || ''
      });
    }
  }, [note]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const updatedNote = { ...formData };
      
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/notes/${formData._id}`,
        updatedNote,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      
      localStorage.setItem('flashMessage', JSON.stringify({
        type: 'success',
        message: '✅ Note updated successfully!'
      }));
      
      onSuccess(response.data);
    } catch (error) {
      localStorage.setItem('flashMessage', JSON.stringify({
        type: 'error',
        message: '❌ Failed to update note'
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
        <label>Image URL: </label>
        <input
          type="url"
          name="imgSrc"
          value={formData.imgSrc}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="edit-form-group">
        <label>Download URL: </label>
        <input
          type="url"
          name="downloadNotesSrc"
          value={formData.downloadNotesSrc}
          onChange={handleChange}
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

NoteEdit.propTypes = {
  note: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    imgSrc: PropTypes.string,
    downloadNotesSrc: PropTypes.string
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default NoteEdit;