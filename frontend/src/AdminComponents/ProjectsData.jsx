import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaExternalLinkAlt, FaImage } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProjectEdit from '../EditForm/ProjectEdit';

const ProjectsData = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetchProjects();
      await fetchUser();
    };
    fetchData();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/data/projects`);
      setProjects(response.data);
      setFilteredProjects(response.data);
      const initialShowState = {};
      response.data.forEach(project => {
        initialShowState[project._id] = false;
      });
      setShowDescriptions(initialShowState);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
      setUser(userResponse.data.user);
      const adminIds = import.meta.env.VITE_ADMIN_IDS?.split(",") || [];
      setIsAdmin(!!(userResponse.data.user?.googleId && adminIds.includes(userResponse.data.user.googleId)));
    } catch (err) {
      setUser(null);
      setIsAdmin(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
  
    if (query === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project =>
        project.title.toLowerCase().includes(lowerQuery) ||
        project.description.toLowerCase().includes(lowerQuery) ||
        (Array.isArray(project.technologies) &&
          project.technologies.some(tech =>
            tech.toLowerCase().includes(lowerQuery)
          )
        )
      );
      setFilteredProjects(filtered);
    }
  };  
  
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

  const toggleDescription = (projectId) => {
    setShowDescriptions(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <div>
      <div className="search-row">
        <Form.Control
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="admin-search-input"
        />
        {isAdmin && (
          <Button as={Link} to="/createpost" variant="primary" className="add-new-btn">
            Add New Project
          </Button>
        )}
      </div>

      <Table bordered hover responsive className="admin-table project-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Technologies</th>
            <th>Live Demo</th>
            <th>Snapshot</th>
            <th>Image</th>
            {isAdmin && <th className="actions-column">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {(searchQuery ? filteredProjects : projects).map(project => (
            <tr key={project._id}>
              <td>{project.title}</td>
              <td>{project.description}</td>
              <td>
                {Array.isArray(project.technologies)
                  ? project.technologies.map(tech => (
                      <Badge key={tech} className="tech-badge">{tech}</Badge>
                    ))
                  : project.technologies}
              </td>
              <td>
                {project.liveDemoSrc && (
                  <a
                    href={project.liveDemoSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-with-icon"
                  >
                    <FaExternalLinkAlt /> Live
                  </a>
                )}
              </td>
              <td>
                {project.snapshotSrc && (
                  <a
                    href={project.snapshotSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-with-icon"
                  >
                    <FaImage /> Snapshot
                  </a>
                )}
              </td>
              <td>
                {project.imgSrc && (
                  <a
                    href={project.imgSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-with-icon"
                  >
                    <FaImage /> Image
                  </a>
                )}
              </td>
              {isAdmin && (
                <td>
                  <div className="action-buttons">
                    <Button
                      variant="link"
                      onClick={() => handleEditClick(project)}
                      aria-label="Edit project"
                      className="edit-btn"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => handleDelete(project._id)}
                      aria-label="Delete project"
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
      
      {isEditing && editingProject && (
        <ProjectEdit
          project={editingProject}
          onUpdate={handleUpdate}
          onCancel={handleCancelEdit}
          show={isEditing}
        />
      )}
    </div>
  );
};

export default ProjectsData;