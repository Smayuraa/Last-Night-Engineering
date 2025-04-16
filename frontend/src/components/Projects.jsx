import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaExternalLinkAlt, FaImage, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import ProjectEdit from '../EditForm/ProjectEdit';
import '../styles/Main.css';
import SearchBar from './SearchBar';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [showDescriptions, setShowDescriptions] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/data/projects`);
        setProjects(projectsResponse.data);
        setFilteredProjects(projectsResponse.data);
        const initialShowState = {};
        projectsResponse.data.forEach(project => initialShowState[project._id] = false);
        setShowDescriptions(initialShowState);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
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
        const userResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
          { 
            headers: { "Authorization": `Bearer ${token}` },
            withCredentials: true 
          }
        );
        setUser(userResponse.data.user);
        const adminIds = import.meta.env.VITE_ADMIN_IDS?.split(",") || [];
        setIsAdmin(!!(userResponse.data.user?.googleId && adminIds.includes(userResponse.data.user.googleId)));
      } catch (err) {
        setUser(null);
        setIsAdmin(false);
      }
    };

    fetchProjects();
    fetchUser();
  }, []);

  const handleDelete = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/projects/${projectId}`,
        {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));
      setFilteredProjects(prevFiltered => prevFiltered.filter(project => project._id !== projectId));
      window.location.reload();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleUpdate = async (updatedProject) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/projects/${updatedProject._id}`,
        updatedProject,
        {
          headers: { "Authorization": `Bearer ${token}` },
          withCredentials: true
        }
      );
      setProjects(prev => prev.map(p => p._id === data._id ? data : p));
      setFilteredProjects(prev => prev.map(p => p._id === data._id ? data : p));
      setEditingProject(null);
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setIsEditing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = projects.filter((project) => {
      return (
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.technologies.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredProjects(filtered);
  };

  const toggleDescription = (projectId) => {
    setShowDescriptions(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const generateSuggestions = () => {
    if (searchQuery.length === 0) return [];
    const query = searchQuery.toLowerCase();
    const suggestions = projects
      .flatMap((project) => {
        const matches = [];
        if (project.title.toLowerCase().includes(query)) matches.push(`${project.title}`);
        if (project.technologies.toLowerCase().includes(query)) matches.push(`${project.technologies}`);
        const descriptionWords = project.description.toLowerCase().split(" ");
        const matchedDescriptionWord = descriptionWords.find((word) => word.includes(query));
        if (matchedDescriptionWord) matches.push(`${matchedDescriptionWord}`);
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
        {(searchQuery ? filteredProjects : projects).map(project => (
          <div key={project._id} className="section-card">
            <div className="section-admin-actions">
              {isAdmin && (
                <>
                  <button onClick={() => handleEditClick(project)} aria-label="Edit project">
                    <FaEdit className="section-icon section-edit-btn" />
                  </button>
                  <button onClick={() => handleDelete(project._id)} aria-label="Delete project">
                    <FaTrash className="section-icon section-del-btn" />
                  </button>
                </>
              )}
              <button 
                onClick={() => toggleDescription(project._id)}
                aria-label="Show description"
                className="section-info-btn"
              >
                <FaInfoCircle className="section-icon section-info-btn" />
              </button>
            </div>

            <div className="section-card-image">
              {project.imgSrc ? (
                <img src={project.imgSrc} alt={project.title} loading="lazy" />
              ) : (
                <div className="section-image-placeholder">
                  <FaImage className="section-placeholder-icon" />
                  <h3>{project.title}</h3>
                </div>
              )}
            </div>

            <div className="section-card-overlay">
              <div className="section-card-details">
                {!showDescriptions[project._id] ? (
                  <>
                    <h3>{project.title}</h3>
                    <div className="section-technologies">
                      {project.technologies}
                    </div>
                  </>
                ) : (
                  <div className="section-description">
                    <p>{project.description}</p>
                  </div>
                )}
                <div className="section-card-actions">
                  {project.liveDemoSrc && (
                    <a 
                      href={project.liveDemoSrc} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="section-action-btn"
                    >
                      <FaExternalLinkAlt className="section-icon" /> Demo
                    </a>
                  )}
                  {project.snapshotSrc && (
                    <a 
                      href={project.snapshotSrc} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="section-action-btn"
                    >
                      <FaImage className="section-icon" /> Snapshots
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && editingProject && (
        <div className="section-edit-modal">
          <ProjectEdit 
            project={editingProject}
            onSuccess={handleUpdate}
            onCancel={handleCancelEdit}
          />
        </div>
      )}
    </div>
  );
};

export default Projects;