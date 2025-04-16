import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaExternalLinkAlt, FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NotesEdit from '../EditForm/NoteEdit';

const NotesData = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchNotes();
      await fetchUser();
    };
    fetchData();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/data/notes`);
      setNotes(response.data);
      setFilteredNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const userResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
        { 
          headers: { "Authorization": `Bearer ${token}` },
          withCredentials: true 
        }
      );
      const adminIds = import.meta.env.VITE_ADMIN_IDS?.split(",") || [];
      setIsAdmin(!!(userResponse.data.user?.googleId && adminIds.includes(userResponse.data.user.googleId)));
    } catch (err) {
      setIsAdmin(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
  
    if (query === "") {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.description.toLowerCase().includes(lowerQuery)
      );
      setFilteredNotes(filtered);
    }
  };
  
  const handleDelete = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/notes/${noteId}`,
        {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      setFilteredNotes(prevFiltered => prevFiltered.filter(note => note._id !== noteId));
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const handleUpdate = async (updatedNote) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/notes/${updatedNote._id}`,
        updatedNote,
        {
          headers: { "Authorization": `Bearer ${token}` },
          withCredentials: true
        }
      );
      setNotes(prev => prev.map(n => n._id === data._id ? data : n));
      setFilteredNotes(prev => prev.map(n => n._id === data._id ? data : n));
      setEditingNote(null);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  const handleEditClick = (note) => {
    setEditingNote(note);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="search-row">
        <Form.Control
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="admin-search-input"
        />
        {isAdmin && (
          <Button as={Link} to="/createnote" variant="primary" className="add-new-btn">
            Add New Note
          </Button>
        )}
      </div>

      <Table bordered hover responsive className="admin-table notes-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Preview</th>
            <th>Download</th>
            {isAdmin && <th className="actions-column">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {(searchQuery ? filteredNotes : notes).map(note => (
            <tr key={note._id}>
              <td>{note.title}</td>
              <td>{note.description}</td>
              <td>
                {note.downloadNotesSrc && (
                  <a
                    href={note.downloadNotesSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-with-icon"
                  >
                    <FaDownload /> Download Notes
                  </a>
                )}
              </td>
              <td>
                {note.imgSrc && (
                  <a
                    href={note.imgSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-with-icon"
                  >
                    <FaExternalLinkAlt /> Preview
                  </a>
                )}
              </td>
              {isAdmin && (
                <td>
                  <div className="action-buttons">
                    <Button
                      variant="link"
                      onClick={() => handleEditClick(note)}
                      aria-label="Edit note"
                      className="edit-btn"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => handleDelete(note._id)}
                      aria-label="Delete note"
                      className="delete-btn"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      
      {isEditing && editingNote && (
        <NotesEdit
          note={editingNote}
          onUpdate={handleUpdate}
          onCancel={handleCancelEdit}
          show={isEditing}
        />
      )}
    </div>
  );
};

export default NotesData;