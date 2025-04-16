import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaImage, FaInfoCircle, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import NoteEdit from '../EditForm/NoteEdit';
import '../styles/Main.css';
import SearchBar from './SearchBar';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [showDescriptions, setShowDescriptions] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/data/notes`);
        setNotes(res.data);
        setFilteredNotes(res.data);
        const initialShow = {};
        res.data.forEach(note => initialShow[note._id] = false);
        setShowDescriptions(initialShow);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      }
    };

    const fetchUser = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        setUser(null);
        setIsAdmin(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
          {
            headers: { "Authorization": `Bearer ${token}` },
            withCredentials: true
          }
        );
        setUser(userRes.data.user);
        const adminIds = import.meta.env.VITE_ADMIN_IDS?.split(",") || [];
        setIsAdmin(!!(userRes.data.user?.googleId && adminIds.includes(userRes.data.user.googleId)));
      } catch (err) {
        setUser(null);
        setIsAdmin(false);
      }
    };

    fetchNotes();
    fetchUser();
  }, []);

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
      setNotes(prev => prev.filter(note => note._id !== noteId));
      setFilteredNotes(prev => prev.filter(note => note._id !== noteId));
      window.location.reload();
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
      window.location.reload();
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

  const toggleDescription = (noteId) => {
    setShowDescriptions(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = notes.filter(note => {
      const title = note.title?.toLowerCase() || '';
      const subject = note.subject?.toLowerCase() || '';
      const description = note.description?.toLowerCase() || '';
      const queryLower = query.toLowerCase();
      
      return (
        title.includes(queryLower) ||
        subject.includes(queryLower) ||
        description.includes(queryLower)
      );
    });
    setFilteredNotes(filtered);
  };

  const generateSuggestions = () => {
    if (searchQuery.length === 0) return [];
    const query = searchQuery.toLowerCase();
    const suggestions = notes
      .flatMap((note) => {
        const matches = [];
        const title = note.title?.toLowerCase() || '';
        const subject = note.subject?.toLowerCase() || '';
        const description = note.description?.toLowerCase() || '';
        
        if (title.includes(query)) matches.push(note.title);
        if (subject.includes(query)) matches.push(note.subject);
        
        const descWords = description.split(" ");
        const matchedWord = descWords.find(word => word.includes(query));
        if (matchedWord) matches.push(matchedWord);
        
        return matches;
      })
      .slice(0, 5);
    return [...new Set(suggestions)];
  };

  const suggestions = generateSuggestions();

  return (
    <div className="section-container">
      <SearchBar onSearch={handleSearch} suggestions={suggestions} />

      <div className="section-grid">
        {(searchQuery ? filteredNotes : notes).map(note => (
          <div key={note._id} className="section-card">
            <div className="section-admin-actions">
              {isAdmin && (
                <>
                  <button onClick={() => handleEditClick(note)} aria-label="Edit note">
                    <FaEdit className="section-icon section-edit-btn" />
                  </button>
                  <button onClick={() => handleDelete(note._id)} aria-label="Delete note">
                    <FaTrash className="section-icon section-del-btn" />
                  </button>
                </>
              )}
              <button
                onClick={() => toggleDescription(note._id)}
                aria-label="Show description"
                className="section-info-btn"
              >
                <FaInfoCircle className="section-icon section-info-btn" />
              </button>
            </div>

            <div className="section-card-image">
              {note.imgSrc ? (
                <img src={note.imgSrc} alt={note.title} loading="lazy" />
              ) : (
                <div className="section-image-placeholder">
                  <FaImage className="section-placeholder-icon" />
                  <h3>{note.title}</h3>
                </div>
              )}
            </div>

            <div className="section-card-overlay">
              <div className="section-card-details">
                {!showDescriptions[note._id] ? (
                  <>
                    <h3>{note.title}</h3>
                    <div className="section-technologies">
                      {note.subject}
                    </div>
                  </>
                ) : (
                  <div className="section-description">
                    <p>{note.description}</p>
                  </div>
                )}
                <div className="section-card-actions">
                  {note.downloadNotesSrc && (
                    <a
                      href={note.downloadNotesSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="section-action-btn"
                    >
                      <FaDownload className="section-icon" /> Download
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && editingNote && (
        <div className="section-edit-modal">
          <NoteEdit
            note={editingNote}
            onSuccess={handleUpdate}
            onCancel={handleCancelEdit}
          />
        </div>
      )}
    </div>
  );
};

export default Notes;
