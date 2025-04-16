import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import UserData from "./UserData";
import ContactsData from "./ContactsData";
import TeachingData from "./TeachingData";
import NotesData from "./NotesData";
import ProjectsData from "./ProjectsData";
import "./Admin.css";
import { FaCrown } from "react-icons/fa";

const Admin = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/datausers')) setActiveTab('users');
    else if (path.includes('/datacontacts')) setActiveTab('contacts');
    else if (path.includes('/dataprojects')) setActiveTab('projects');
    else if (path.includes('/datateaching')) setActiveTab('teaching');
    else if (path.includes('/datanotes')) setActiveTab('notes');
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isBasePath = location.pathname === "/admin";

  return (
    <div className="admin-container">
      {isBasePath && <Navigate to="/admin/datausers" replace />}
      <div className="admin-navbar">
        <div 
          className={`hamburger ${isMenuOpen ? "active" : ""}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <FaCrown />
        </div>
        <ul className={`admin-nav ${isMenuOpen ? "active" : ""}`}>
          <li 
            className={activeTab === 'users' ? "active" : ""}
            onClick={closeMenu}
          >
            <Link to="/admin/datausers" className="admin-nav-link">Users</Link>
          </li>
          <li 
            className={activeTab === 'contacts' ? "active" : ""}
            onClick={closeMenu}
          >
            <Link to="/admin/datacontacts" className="admin-nav-link">Contacts</Link>
          </li>
          <li 
            className={activeTab === 'projects' ? "active" : ""}
            onClick={closeMenu}
          >
            <Link to="/admin/dataprojects" className="admin-nav-link">Projects</Link>
          </li>
          <li 
            className={activeTab === 'teaching' ? "active" : ""}
            onClick={closeMenu}
          >
            <Link to="/admin/datateaching" className="admin-nav-link">Teaching</Link>
          </li>
          <li 
            className={activeTab === 'notes' ? "active" : ""}
            onClick={closeMenu}
          >
            <Link to="/admin/datanotes" className="admin-nav-link">Notes</Link>
          </li>
        </ul>
      </div>
      <div className="admin-content">
        <Routes>
          <Route path="/datausers" element={<UserData />} />
          <Route path="/datacontacts" element={<ContactsData />} />
          <Route path="/datateaching" element={<TeachingData />} />
          <Route path="/datanotes" element={<NotesData />} />
          <Route path="/dataprojects" element={<ProjectsData />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;